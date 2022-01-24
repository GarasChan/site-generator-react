// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { withSessionRoute } from '../../lib/with-session';

const handler = nextConnect({
  onError(error, _, res: NextApiResponse<any>) {
    res.status(501).json({ message: error.message });
  }
});

handler.post(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'Admin@1234') {
    req.session.user = {
      id: 'admin',
      admin: username === 'admin'
    };
    await req.session.save();
    res.status(200).json({ success: true });
    return;
  }
  await req.session.destroy();
  const message = username !== 'admin' ? '用户名错误或用户名不存在' : '密码错误，请检查并重新输入';
  res.status(401).json({ message });
});

export default withSessionRoute(handler);
