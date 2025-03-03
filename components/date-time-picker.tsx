"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<{
    hours: string
    minutes: string
  }>({
    hours: date ? String(date.getHours()).padStart(2, "0") : "12",
    minutes: date ? String(date.getMinutes()).padStart(2, "0") : "00",
  })

  // Actualizar la fecha cuando cambia la hora o los minutos
  React.useEffect(() => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(Number.parseInt(selectedTime.hours))
      newDate.setMinutes(Number.parseInt(selectedTime.minutes))
      setDate(newDate)
    }
  }, [selectedTime, date, setDate])

  // Generar opciones para horas y minutos
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white border-lime-300 hover:bg-lime-50 hover:text-lime-700",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-lime-600" />
            {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            locale={es}
            className="border-lime-200"
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <Select
          value={selectedTime.hours}
          onValueChange={(value) => setSelectedTime({ ...selectedTime, hours: value })}
        >
          <SelectTrigger className="bg-white border-lime-300 hover:bg-lime-50">
            <SelectValue placeholder="Hora" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="flex items-center text-lime-700 font-bold">:</span>

        <Select
          value={selectedTime.minutes}
          onValueChange={(value) => setSelectedTime({ ...selectedTime, minutes: value })}
        >
          <SelectTrigger className="bg-white border-lime-300 hover:bg-lime-50">
            <SelectValue placeholder="Minutos" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

