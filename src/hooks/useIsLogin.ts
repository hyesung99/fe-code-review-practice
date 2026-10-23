import { useAtomValue } from "jotai";
import { userAtom } from "../atoms/user";
export const useIsLogin = () => {
  const user = useAtomValue(userAtom);
  return { isLogin: user.isLogin };
};
