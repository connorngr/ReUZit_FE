import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  sub: string;
  role: [{ authority: string }];
  iat: number;
  exp: number;
}

// Example function to extract role from JWT
export const getUserRole = (token: string): string => {
  const decodedToken = jwtDecode<JWTPayload>(token);
  console.log(decodedToken.role[0].authority);
  
  return decodedToken.role[0].authority;
};
