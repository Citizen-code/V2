import Layout from "@/app/(main)/employee/layout";
import { HiCursorClick } from "react-icons/hi";
import { MainCard } from "./main-card";

export default function MainEmployee() {

  return <Layout>
    <div className='flex flex-row flex-wrap place-content-center place-items-center flex-grow justify-center items-center gap-5 container'>
      <MainCard
        title="Тестирования"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Прохождение тестирований'}
        value={'/employee/tests'}
        className="shadow-md shadow-red-600"
      />
      <MainCard
        title="Экзамены"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Прохождение экзаменационных тестирований'}
        value={'/employee/exams'}
        className="shadow-md shadow-red-600"
      />
      <MainCard
        title="Профиль"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Просмотр информации о текущем пользователе'}
        value={'/employee/profile'}
        className="shadow-md shadow-red-600"
      />
    </div>
  </Layout>
}

