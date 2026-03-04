import z, { ZodType } from "zod";

export async function validateBody<T>(
  req: Request,
  schema: ZodType<T>,
): Promise<T> {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    const errors = z.treeifyError(result.error);
    throw new Error(JSON.stringify(errors));
  }
  return result.data;
}
