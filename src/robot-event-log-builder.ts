import { firestore } from "./libs/firestore";

export const eventLogBuilder = async (data, context) => {
  const eventKey = context.params.eventKey;
  const matchId = context.params.matchId;
  const teamId = context.params.teamId;

  const robotEventLog = data.value.fields.events.arrayValue.values;

  let eventLogs: any[] = robotEventLog.map(eventLog => {
    return {
      eventKey,
      matchId,
      teamId,
      eventType: eventLog.mapValue.fields.eventType.stringValue,
      timestamp: eventLog.mapValue.fields.timestamp.integerValue
    };
  });

  const frcEventDataDoc = firestore.collection("events").doc(eventKey);
  const frcEventData = (await frcEventDataDoc.get()).data();

  let teamStatsForMatch = [
    {
      eventKey,
      matchId,
      teamId,
      high: data.value.fields.points.mapValue.fields.high.integerValue,
      low: data.value.fields.points.mapValue.fields.low.integerValue,
      miss: data.value.fields.points.mapValue.fields.miss.integerValue,
      fouls: data.value.fields.defense.mapValue.fields.fouls.integerValue,
      techFouls: data.value.fields.defense.mapValue.fields.tech.integerValue,
      scouter: data.value.fields.scout.stringValue,
      defenseRating:
        data.value.fields.defense.mapValue.fields.rating.integerValue,
      hasAutoBalance: data.value.fields.endgame.mapValue.fields.balanced
        .integerValue
        ? true
        : false,
      climbSuccessful: data.value.fields.endgame.mapValue.fields.climbed
        .integerValue
        ? true
        : false,
      failedToClimbed: data.value.fields.endgame.mapValue.fields.failed
        .integerValue
        ? true
        : false,
      parkSuccessful:
        data.value.fields.endgame.mapValue.fields.parked.integerValue ||
        data.value.fields.endgame.mapValue.fields.failed.integerValue
          ? true
          : false,
      wheelMoved: data.value.fields.wheel.mapValue.fields.position.integerValue
        ? "position"
        : data.value.fields.wheel.mapValue.fields.rotation.integerValue
        ? "rotation"
        : "none",
      estop: data.value.fields.status.mapValue.fields.estop.integerValue
        ? true
        : false,
      redCard: data.value.fields.status.mapValue.fields.red.integerValue
        ? true
        : false,
      yellowCard: data.value.fields.status.mapValue.fields.yellow.integerValue
        ? true
        : false,
      comments: data.value.fields.comments.stringValue
    }
  ];

  if (frcEventData && frcEventData.eventLogs) {
    eventLogs = eventLogs.concat(frcEventData.eventLogs);
  }

  if (frcEventData && frcEventData.teamStatsForMatch) {
    teamStatsForMatch = teamStatsForMatch.concat(
      frcEventData.teamStatsForMatch
    );
  }

  frcEventDataDoc.set(
    {
      eventLogs,
      teamStatsForMatch
    },
    { merge: true }
  );
};
