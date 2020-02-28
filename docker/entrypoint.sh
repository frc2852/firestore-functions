#! /bin/sh

gcloud auth activate-service-account --key-file /app/firebase-service-account.json
gcloud config set project $GCP_PROJECT_ID

gcloud functions deploy robot-event-log-trigger \
--entry-point eventLogBuilder \
--trigger-event providers/cloud.firestore/eventTypes/document.create \
--trigger-resource projects/${GCP_PROJECT_ID}/databases/\(default\)/documents/events/\{eventKey\}/robots/\{teamId\}/matches/\{matchId\} \
--max-instances=1 --region=${GCP_REGION} --stage-bucket=${STAGE_BUCKET} --runtime nodejs10