import { NextResponse } from 'next/server';
import dbConnect, { NotificationModel } from '@/lib/db/mongodb';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        const notifications = await NotificationModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json({ success: true, data: notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { userId, notificationIds } = body;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        if (notificationIds && Array.isArray(notificationIds)) {
            // Mark specific notifications as read
            await NotificationModel.updateMany(
                { _id: { $in: notificationIds }, userId },
                { $set: { isRead: true } }
            );
        } else {
            // Mark all as read
            await NotificationModel.updateMany(
                { userId, isRead: false },
                { $set: { isRead: true } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { userId, type, content } = body;

        if (!userId || !type || !content) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const newNotification = await NotificationModel.create({
            userId,
            type,
            content,
            isRead: false
        });

        return NextResponse.json({ success: true, data: newNotification });
    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 });
    }
}
