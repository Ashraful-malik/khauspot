"use client";
import Image from "next/image";

export type recentCheckinCardProps = {
  _id: string;
  comment?: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
  type: string;
};
function RecentCheckinCard({ checkin }: { checkin: recentCheckinCardProps }) {
  console.log(checkin);
  return (
    <div className="flex gap-3 items-start">
      <Image
        src={checkin?.user?.avatar}
        alt="profile"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div>
        <p className="text-sm font-medium">{checkin?.user?.name}</p>
        {checkin && checkin.comment !== "" ? (
          <p className="text-sm text-gray-500">{checkin.comment}</p>
        ) : (
          <p className="text-sm text-gray-500">checked in</p>
        )}
      </div>
    </div>
  );
}

export default RecentCheckinCard;
