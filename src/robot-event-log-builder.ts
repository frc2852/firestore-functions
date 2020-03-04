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

  console.log(
    "this is climb test",
    data.value.fields.endgame.mapValue.fields.climbed.integerValue == 1
  );
  console.log(
    "this is climb value",
    data.value.fields.endgame.mapValue.fields.climbed.integerValue
  );

  let teamStatsForMatch = [
    {
      eventKey,
      matchId,
      teamId,
      teamColor: data.value.fields.color.stringValue,
      driveStation: data.value.fields.driveStation.integerValue,
      startTime: data.value.fields.matchStartTime.integerValue,
      formComplete: data.value.fields.formComplete.integerValue,
      high: data.value.fields.points.mapValue.fields.high.integerValue,
      low: data.value.fields.points.mapValue.fields.low.integerValue,
      miss: data.value.fields.points.mapValue.fields.miss.integerValue,
      fouls: data.value.fields.defense.mapValue.fields.fouls.integerValue,
      techFouls: data.value.fields.defense.mapValue.fields.tech.integerValue,
      scouter: data.value.fields.scout.stringValue,
      defenseRating:
        data.value.fields.defense.mapValue.fields.rating.integerValue,
      hasAutoBalance:
        data.value.fields.endgame.mapValue.fields.balanced.integerValue == 1
          ? true
          : false,
      climbSuccessful:
        data.value.fields.endgame.mapValue.fields.climbed.integerValue == 1
          ? true
          : false,
      failedToClimbed:
        data.value.fields.endgame.mapValue.fields.failed.integerValue == 1
          ? true
          : false,
      parkSuccessful:
        data.value.fields.endgame.mapValue.fields.parked.integerValue == 1 ||
        data.value.fields.endgame.mapValue.fields.failed.integerValue == 1
          ? true
          : false,
      wheelMoved:
        data.value.fields.wheel.mapValue.fields.position.integerValue == 1
          ? "position"
          : data.value.fields.wheel.mapValue.fields.rotation.integerValue == 1
          ? "rotation"
          : "none",
      estop:
        data.value.fields.status.mapValue.fields.estop.integerValue == 1
          ? true
          : false,
      redCard:
        data.value.fields.status.mapValue.fields.red.integerValue == 1
          ? true
          : false,
      yellowCard:
        data.value.fields.status.mapValue.fields.yellow.integerValue == 1
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
