"use client";

import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import { TRegisterUserForm, registerUserForm } from "./registerValidator";
import { api } from "@/app/service/api";
import { cpf_validator } from "@/app/utils/cpfValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useUser } from "@/app/hooks/useUser";

export default function FormRegister() {
  const [cpf, setCpf] = useState<string | undefined>("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const { getUsers } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TRegisterUserForm>({
    resolver: zodResolver(registerUserForm),
  });

  const submit = handleSubmit(async (data) => {
    setButtonDisable(true);

    try {
      const response = await api.post("/users", data);

      toast.success("Usuário criado com sucesso!");
    } catch (error: any) {
      toast.error(String(Object.values(error.response.data)[0]));
    } finally {
      setButtonDisable(false);
      getUsers();
    }
  });

  return (
    <form onSubmit={submit}>
      <Input
        type="text"
        register={register("name")}
        labelChildren="Nome"
        errorText={errors.name && errors.name.message}
      />

      <Input
        type="text"
        register={register("lastname")}
        labelChildren="Sobrenome"
        errorText={errors.lastname && errors.lastname.message}
      />

      <Input
        type="email"
        register={register("email")}
        labelChildren="email"
        errorText={errors.email && errors.email.message}
      />

      <Input
        type="text"
        register={register("cpf")}
        onInput={(e) => setCpf(cpf_validator(e.currentTarget.value))}
        maxLength={14}
        value={cpf}
        labelChildren="CPF"
        errorText={errors.cpf && errors.cpf.message}
      />

      <Input
        type="date"
        register={register("birthday")}
        labelChildren="Data de nascimento"
        errorText={errors.birthday && errors.birthday.message}
      />

      <select
        {...register("gender")}
        defaultValue={"DEFAULT"}
        className="outline-none border-none rounded-lg w-full bg-blue-100 text-gray-800 px-3 py-2 mb-5"
      >
        <option hidden value="DEFAULT">
          Escolha seu gênero
        </option>
        <option value="male">Masculino</option>
        <option value="female">Feminino</option>
      </select>

      {errors.gender && (
        <p className="text-xs text-red-500">Escolha um gênero</p>
      )}

      <div className="flex gap-4">
        <Button
          className="bg-gray-500 text-white w-full py-2 px-3 rounded-lg hover:bg-gray-600 duration-200"
          onClick={() => {
            reset({
              birthday: "",
              cpf: "",
              email: "",
              gender: "DEFAULT",
              lastname: "",
              name: "",
            }),
              setCpf("");
          }}
        >
          Recomeçar
        </Button>
        <Button
          type="submit"
          className={`${
            buttonDisable ? "opacity-50 bg-blue-500" : "bg-blue-500"
          } text-white w-full py-2 px-3 rounded-lg hover:bg-blue-600 duration-200 flex justify-center items-center`}
          disabled={buttonDisable}
        >
          {buttonDisable ? (
            <div className="animate-spin h-5 w-5 border-4 border-white border-t-blue-400 rounded-full"></div>
          ) : (
            "Inserir"
          )}
        </Button>
      </div>
    </form>
  );
}
