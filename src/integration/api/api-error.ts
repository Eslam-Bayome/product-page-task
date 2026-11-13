export class ApiError extends Error {
  readonly status: number;
  readonly context: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    context: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.context = context;
  }

  /** EasyOrders answers unknown slugs with 400 "record not found". */
  get isNotFound() {
    return this.status === 404 || /not found/i.test(this.message);
  }
}
