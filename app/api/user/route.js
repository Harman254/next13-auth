import { ConnectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";



export async function POST(request) {
 const {name, email} = await request.json();
 await ConnectMongoDB();
 await User.create({name, email});
 return NextResponse.json({message: "User Registered."}, {status: 201,})
}

