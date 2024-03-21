const {gql} = require('apollo-server-express');
const {Usermodel}= require('../models/User');
const {Messagemodel}  = require('../models/Post');
const  argon2 =require("argon2");
const  jwt = require("jsonwebtoken");

const typeDefs = gql`
  type User {
    id: ID
    name: String!
    email: String!
    password: String!
  }

  type Post {
    post: String!
    sender: String!
  }

  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
  }

  type AuthPayload {
    user: User
    token: String
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload
    send(post: String!, sender: String!): Post
  }
`;

const resolvers = {
    Query: {
      getUser: async (parent, {id}) => {
        try {
          await Usermodel.findOne({_id: id});
        } catch (err) {
          console.log(err);
        }
      },
  
      getAllUsers: async () => {
        try {
          return await Usermodel.find();
        } catch (err) {
          console.log(err);
        }
      },
    },

      Mutation: {
        signup: async (parent, args, context, info) => {
          try {
              console.log(args);
            const {name, email, password} = args;
            // const userExists = await Usermodel.findOne({email});
            // if (userExists) {
            //   throw Error("This email already registered");
            // }
            const hpassword = await argon2.hash(password);
    
            const newUser = await Usermodel.save({
              name,
              email,
              password: hpassword,
            });
            return newUser;
          } catch (err) {
            console.log(err);
          }
        },
    
        login: async (parent, args, context, info) => {
          try {
            const {email, password} = args;
            const user = await Usermodel.findOne({email});
            if (!user) {
              throw Error("This email is not registered");
            }
    
            const flag = await argon2.verify(user.password, password);
            if (!flag) {
              throw Error("Incorrect Password", flag);
            }
            const token = jwt.sign(
              {data: {userId: user._id, email, name: user.name}},
              "secretkey"
            );
            return {user, token};
          } catch (err) {
            console.log(err);
          }
        },
    
        send: async (parent, args, context, info) => {
          console.log("req from client", args);
          try {
            const {post, sender} = args;
            const newPost = await Messagemodel.create({post, sender});
            return newPost;
          } catch (err) {
            console.log(err);
            throw err;
          }
        },
      },
};
    
    module.exports =  {typeDefs, resolvers};