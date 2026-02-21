import passport from "passport";
import { Strategy as GoogleStrategy,Profile, VerifyCallback} from "passport-google-oauth20";
import { prismaClient } from "@repo/db/client";
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientID || !clientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}
passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "http://localhost:3001/api/v1/auth/google/callback"
    },
    async (accessToken: string, refreshToken: string,profile: Profile,done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("No email found from Google"), undefined);
        }
        let user = await prismaClient.user.findFirst({ where:{email}});
        if(user && !user.googleId){
          user=await prismaClient.user.update({where:{email},data:{googleId:profile.id}})
        }
        if (!user) {
          user = await prismaClient.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email:email,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);