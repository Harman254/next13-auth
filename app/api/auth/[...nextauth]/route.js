import { ConnectMongoDB } from '@/libs/mongodb';
import User from '@/models/User';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log('User:', user);
      console.log('Account:', account);

      if (account.provider === 'google') {
        const { name, email } = user;

        try {
          await ConnectMongoDB();

          const userExists = await User.findOne({ email });

          if (!userExists) {
            const res = await fetch('http://localhost:3000/api/user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name,
                email
              }), 
            });

            if (res.ok) {
              return user;
            } else {
              // Handle the error if the POST request fails
              console.log('Failed to save user on the server.');
              // You might want to do something else, like showing an error message to the user.
            }
          } else {
            // The user already exists in the database, do something else if needed.
          }
        } catch (error) {
          console.log('Error:', error);
          // Handle the exception if an error occurs during the POST request.
          // You might want to show a generic error message to the user.
        }
      }

      return user;
    },
  },
};

const handler = NextAuth(authOptions);



export { handler as GET, handler as POST };