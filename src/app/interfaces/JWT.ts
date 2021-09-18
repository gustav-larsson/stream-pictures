export interface JWT {
  access_token: string,
  expires_in: number,
  id_token: string,
  refresh_token: string,
  scope: Array<string>,
  token_type: string
}
