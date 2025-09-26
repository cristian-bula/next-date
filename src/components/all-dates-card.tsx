import React from "react";
import { DateEvent } from "@/types/date";
import { Calendar, Edit, Heart, Trash2, Users } from "lucide-react";
import { getAverageRating } from "@/lib/utils";

const AllDatesCard = ({
  date,
  handleEdit,
  onDeleteDate,
  index,
  from,
}: {
  date: DateEvent;
  handleEdit: (index: number, from: "withDate" | "withoutDate") => void;
  onDeleteDate: (id: string) => void;
  index: number;
  from: "withDate" | "withoutDate";
}) => {
  return (
    <div
      key={date.id}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:scale-[1.02] transition-transform"
    >
      {date.photos && date.photos.length > 0 ? (
        <img
          src={date.photos[0]}
          alt="Foto del date"
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-pink-200 to-purple-200 flex items-center justify-center text-gray-600">
          💕 Sin foto
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-xl font-semibold text-primary">
          {date.description}
        </h3>
        <div className="flex items-center text-gray-500 text-sm gap-1">
          <Calendar size={16} />
          {date.date
            ? new Date(date.date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Sin fecha"}
        </div>
        {date.dressCode && (
          <div className="flex items-center gap-1 mt-1 text-olive-500">
            <Users size={16} />
            <span className="font-medium">{date.dressCode}</span>
          </div>
        )}
        {date.reviews && date.reviews.length > 0 && (
          <div className="flex items-center gap-1 mt-1 text-olive-500">
            <Heart className="w-4 h-4 fill-olive-500" />
            {getAverageRating(date.reviews)} / 5.0
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 -mt-12">
          <button
            onClick={() => handleEdit(index, from)}
            className="p-2 rounded-full bg-primary/20 hover:bg-primary/80 transition"
          >
            <Edit size={18} className="text-primary" />
          </button>
          {((date?.date && date?.date > new Date()) || !!!date.date) && (
            <button
              onClick={() => onDeleteDate(date.id)}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
            >
              <Trash2 size={18} className="text-red-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDatesCard;
