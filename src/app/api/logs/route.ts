import { NextResponse } from "next/server";
import { dynamoDocClient, TABLE_NAME } from "@/lib/aws";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

// GET all incident logs from AWS DynamoDB
export async function GET() {
  try {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await dynamoDocClient.send(command);
    return NextResponse.json(response.Items || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new diagnosed incident log into AWS DynamoDB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { service, logLevel, errorCode, rawMessage, aiDiagnosis } = body;

    const timestamp = new Date().toISOString();
    const logId = "log_" + Math.random().toString(36).substring(2, 11);

    const newLogItem = {
      PK: "ORG#1234",
      SK: `LOG#${timestamp}#${logId}`,
      id: logId,
      timestamp,
      service: service || "Unknown-Service",
      logLevel: logLevel || "INFO",
      errorCode: errorCode || "NONE",
      rawMessage: rawMessage || "",
      aiDiagnosis: aiDiagnosis || "System normal. No remediation steps required.",
      status: "UNRESOLVED",
    };

    await dynamoDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newLogItem,
      })
    );

    return NextResponse.json(newLogItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
