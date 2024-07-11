import connectDB from "@/lib/db";
import { Post } from "@/models/post.model";
import { NextRequest, NextResponse } from "next/server";

// GET LIKES
export const GET = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  try {
    await connectDB();
    const post = await Post.findById({ _id: params.postId });
    if (!post) return NextResponse.json({ error: "Post not found" });
    return NextResponse.json(post.likes);
  } catch (error) {
    return NextResponse.json({ error: "An error occured." });
  }
};

// POST LIKES
export const POST = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  try {
    await connectDB();
    const userId = await req.json();
    const post = await Post.findById({ _id: params.postId });
    if (!post) return NextResponse.json({ error: "Post not found" });
    await post.updateOne({ $addToSet: { likes: userId } });
    return NextResponse.json({ message: "Post likes successfully" });
  } catch (error) {
    return NextResponse.json({ error: "An error occured." });
  }
};
