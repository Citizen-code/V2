import Layout from "@/app/(main)/teacher/layout";
import { HiCursorClick } from "react-icons/hi";
import { MainCard } from "./main-card";

export default function MainTeacher() {

  return <Layout>
    <div className='flex flex-col place-content-center place-items-center flex-grow justify-center items-center gap-5'>
      <div className="flex gap-5 flex-wrap justify-center items-center">
        <MainCard
          title="Тестирования"
          icon={<HiCursorClick className="text-red-600" />}
          helperText={'Создание тестирований для прохождения'}
          value={'/teacher/tests'}
          className="shadow-md shadow-red-600"
        />
        <MainCard
          title="Экзамены"
          icon={<HiCursorClick className="text-pink-600" />}
          helperText={'Создание экзаменов для прохождения'}
          value={'/teacher/tests/exam'}
          className="shadow-md shadow-pink-600"
        />
      </div>
      <div className="flex gap-5 flex-wrap justify-center items-center">
        <MainCard
          title="Профиль"
          icon={<HiCursorClick className="text-purple-600" />}
          helperText={'Просмотр информации о текущем пользователе'}
          value={'/teacher/profile'}
          className="shadow-md shadow-purple-600"
        />
        <MainCard
          title="О приложении"
          icon={<HiCursorClick className="text-cyan-600" />}
          helperText={'Просмотр информации о работе приложения'}
          value={'/about'}
          className="shadow-md shadow-cyan-600"
        />
      </div>
    </div>
  </Layout>
}

