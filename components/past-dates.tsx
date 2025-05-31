"use client";
import { DateEvent } from "@/types/date";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { IReview } from "@/types/reviews";
import { useStore } from "@/store/globalState";
import { revalidateClientPath } from "@/lib/actions";
import { PhotoProvider, PhotoView } from "react-photo-view";
import toast from "react-hot-toast";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/modal";

const getAverageRating = (reviews: IReview[]) => {
  if (!reviews?.length) return 0;
  const total = reviews?.reduce((sum, r) => sum + r.rating, 0);
  return (total / reviews?.length).toFixed(1);
};

const PastDates = ({ pastDates }: { pastDates: DateEvent[] }) => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 8 },
    loop: true,
  });
  const [selectedDate, setSelectedDate] = useState<Partial<DateEvent> | null>(
    null
  );
  const { user } = useStore();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleClose = () => {
    if (isGalleryOpen) return;
    setSelectedDate(null);
    onOpenChange();
  };

  const handleSubmitReview = async () => {
    if (!selectedDate || !newRating) return;

    const review: Partial<IReview> = {
      rating: newRating,
      comment: newComment,
      dateId: selectedDate.id,
      userId: user?.id || "",
      user: user as any,
    };

    const createMsg = toast.loading("Cargando...");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });

      if (!res.ok) throw new Error("Error al enviar la reseña");
      revalidateClientPath("/");
      const data = await res.json();
      const newReview = data as IReview;
      selectedDate?.reviews?.push(newReview);
      setNewRating(0);
      setNewComment("");
    } catch (error) {
      toast.error("Ups, creo que ya agregaste tu reseña 👀");
      console.error("Error enviando la reseña:", error);
    } finally {
      toast.dismiss(createMsg);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const createMsg = toast.loading("Cargando...");
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar la reseña");
      revalidateClientPath("/");

      const updatedReviews = selectedDate?.reviews?.filter(
        (r) => r.id !== reviewId
      );
      setSelectedDate({
        ...selectedDate,
        reviews: updatedReviews || [],
      });

      toast.success("Reseña eliminada");
    } catch (error) {
      toast.error("No se pudo eliminar la reseña");
      console.error("Error al eliminar la reseña:", error);
    } finally {
      toast.dismiss(createMsg);
    }
  };

  return (
    <>
      {pastDates?.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-olive-300 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-olive-700 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Citas Pasadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div ref={sliderRef} className="keen-slider">
                {pastDates.map((date) => (
                  <div
                    key={date.id}
                    className="keen-slider__slide w-full min-w-full"
                  >
                    <Card
                      onClick={() => setSelectedDate(date)}
                      className="cursor-pointer hover:scale-[1.01] transition-all rounded-xl overflow-hidden"
                    >
                      <img
                        src={date.photos?.[0]}
                        alt={date.description}
                        className="w-full h-48 md:h-72 object-cover"
                        draggable={false}
                      />
                      <CardContent className="px-5">
                        <p className="text-olive-700 font-semibold mt-4">
                          {date.date?.toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-olive-600 line-clamp-1 text-xs">
                          Código de vestimenta: {date.dressCode || "No aplica"}
                        </p>
                        <p className="text-olive-600 line-clamp-2">
                          {date.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-olive-500">
                          <Heart className="w-4 h-4 fill-olive-500" />
                          {getAverageRating(date.reviews)} / 5.0
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => slider.current?.prev()}
                >
                  <ChevronLeft />
                </Button>
              </div>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => slider.current?.next()}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <PhotoProvider
        onVisibleChange={(visible) => {
          setIsGalleryOpen(visible);
        }}
        maskOpacity={0.1}
        bannerVisible={false}
      >
        <Modal
          placement="center"
          size="5xl"
          isOpen={!!selectedDate}
          scrollBehavior="outside"
          onOpenChange={handleClose}
        >
          <ModalContent>
            {(onClose) => (
              <ModalBody className="py-4">
                {selectedDate && (
                  <div>
                    <h2 className="text-xl font-bold text-olive-700 mb-2">
                      {selectedDate.date?.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h2>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {selectedDate?.photos?.map((photo, i) => (
                        <PhotoView key={i} src={photo}>
                          <img
                            key={i}
                            src={photo}
                            alt={`Foto ${i + 1}`}
                            className="rounded-lg w-full h-32 object-cover"
                          />
                        </PhotoView>
                      ))}
                    </div>

                    <p className="text-olive-600 mb-4">
                      {selectedDate.description}
                    </p>

                    <h3 className="text-md font-semibold mb-2">
                      Escribe tu reseña
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Heart
                          key={value}
                          onClick={() => setNewRating(value)}
                          className={`w-7 h-7 cursor-pointer text-gray-400 ${
                            value <= newRating ? " fill-olive-500" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      rows={4}
                      className="w-full border roundsed p-2 mb-2 text-sm"
                    />
                    <h3 className="text-md font-semibold mb-2">Reseñas</h3>

                    <div className="space-y-2 mb-4">
                      {!!selectedDate?.reviews?.length ? (
                        selectedDate?.reviews?.map((review) => (
                          <div
                            key={review.id}
                            className="bg-olive-100 rounded p-2 text-sm relative"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {review?.user?.photo && (
                                <img
                                  src={review?.user?.photo}
                                  alt={review?.user?.name || "Usuario"}
                                  width={24}
                                  height={24}
                                  className="rounded-full object-cover w-6 h-6"
                                />
                              )}
                              <span className="text-olive-700 font-medium">
                                {review?.user?.name || "Anónimo"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-olive-500 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Heart
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? "fill-olive-500" : ""
                                  }`}
                                />
                              ))}
                            </div>
                            <p>{review.comment}</p>
                            {review.userId === user?.id && (
                              <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                <X className="w-2 h-2 fill-olive-500 float-right" />
                              </Button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No hay reseñas aún.</p>
                      )}
                    </div>
                    <Button onClick={handleSubmitReview} disabled={!newRating}>
                      Enviar reseña
                    </Button>
                  </div>
                )}
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </PhotoProvider>
    </>
  );
};

export default PastDates;
