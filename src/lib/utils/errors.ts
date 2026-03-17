export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  public fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof NotFoundError) {
    return Response.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof ValidationError) {
    return Response.json(
      { error: error.message, fields: error.fields },
      { status: 400 }
    );
  }
  console.error("Unhandled error:", error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
