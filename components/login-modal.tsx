"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "@/store/globalState";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { revalidateClientPath } from "@/lib/actions";
import { useRouter } from "next/navigation";

export function LoginModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();
      setUser(data.user);
      toast.success("¡Login exitoso!");
      revalidateClientPath("/dates");
      router.push("/");
      onOpenChange();
    } catch (error) {
      toast.error("Error al iniciar sesión.");
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        className="bg-olive-600 hover:bg-olive-700 text-white"
      >
        Iniciar Sesión
      </Button>
      <Modal
        placement="center"
        size="5xl"
        isOpen={isOpen}
        scrollBehavior="outside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="my-3">
              <ModalHeader className="text-olive-700 flex items-center gap-2 p-0">
                <LogIn className="h-5 w-5" />
                Iniciar Sesión
              </ModalHeader>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-olive-700">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-olive-700">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                    className="border-olive-300 text-olive-700 hover:bg-olive-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-olive-600 hover:bg-olive-700 text-white"
                  >
                    Entrar
                  </Button>
                </div>
              </form>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
