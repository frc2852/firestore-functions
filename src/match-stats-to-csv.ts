import { firestore } from "./libs/firestore";
import { Request, Response } from "express";

export const getCsvFromMatchStats = async (req: Request, res: Response) => {
  const eventKey = req.query.eventKey;

  const eventDocRef = firestore.doc("/events/" + eventKey);
  const eventDoc = await eventDocRef.get();
  const event = eventDoc.data();

  if (!event) {
    res.status(404);
    res.send("Event not found");
  } else {
    const header = [
      "Team ID",
      "Match Number",
      "Scouter",
      "High Shots",
      "Low Shots",
      "Miss Shots",
      "Wheel Moved",
      "Defense Rating",
      "Did Auto Balance",
      "Climb Successful",
      "Fail To Climb",
      "Park Successful",
      "Disconnected",
      "Foul",
      "Tech Foul",
      "Comments"
    ];

    const matchRows = event.teamStatsForMatch.map(match => {
      return [
        match.teamId.replace("frc", ""),
        match.matchId.split("_")[1].match(/\w{2}(\d*)/)[1],
        !match.scouter || match.scouter.length === 0
          ? "No scout name was entered"
          : match.scouter,
        match.high,
        match.low,
        match.miss,
        match.wheelMoved,
        match.defenseRating,
        match.hasAutoBalance,
        match.climbSuccessful,
        match.failedToClimbed,
        match.parkSuccessful,
        match.estop,
        match.fouls,
        match.techFouls,
        match.comments && match.comments.length > 0
          ? match.comments.replace(/[\n\r]/gm, " --- ")
          : ""
      ].join(",");
    });

    const csv = [header.join(","), ...matchRows];

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");
    res.contentType("text/csv");
    res.send(csv.join("\n"));
  }
};
