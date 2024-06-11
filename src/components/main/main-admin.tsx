import Layout from "@/app/(main)/admin/layout";
import { HiCursorClick } from "react-icons/hi";
import { MainCard } from "./main-card";


export default function MainAdmin() {

  return <Layout>
    <div className='flex flex-col place-content-center place-items-center flex-grow justify-center items-center gap-5'>
      <div className="flex gap-5 flex-wrap justify-center items-center">
        <MainCard
          title="Тестирования"
          icon={<HiCursorClick className="text-red-600" />}
          helperText={'Управление существующими тестированиями'}
          value={'/admin/tests'}
          className="shadow-md shadow-red-600"
        />
        <MainCard
          title="Сотрудники"
          icon={<HiCursorClick className="text-pink-600" />}
          helperText={'Управление, изменение и контроль сотрудников'}
          value={'/admin/users'}
          className="shadow-md shadow-pink-600"
        />
        <MainCard
          title="База данных"
          icon={<HiCursorClick className="text-purple-600" />}
          helperText={'Управление состоянием базы данных'}
          value={'/admin/database'}
          className="shadow-md shadow-purple-600"
        />
      </div>
      <div className="flex gap-5 flex-wrap justify-center items-center">
        <MainCard
          title="О приложении"
          icon={<HiCursorClick className="text-blue-600" />}
          helperText={'Просмотр информации о работе приложения'}
          value={'/about'}
          className="shadow-md shadow-blue-600"
        />
        <MainCard
          title="Профиль"
          icon={<HiCursorClick className="text-cyan-600" />}
          helperText={'Просмотр информации о текущем пользователе'}
          value={'/admin/profile'}
          className="shadow-md shadow-cyan-600"
        />
      </div>
    </div>
  </Layout>
}

