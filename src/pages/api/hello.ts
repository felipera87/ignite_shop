import { NextApiRequest, NextApiResponse } from "next";

// this route is available on /api/hello
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.json({ message: 'Hello' })
}