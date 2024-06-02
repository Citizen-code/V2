import Layout from "@/app/(main)/admin/layout";
import { HiCursorClick } from "react-icons/hi";
import { MainCard } from "./main-card";


export default function MainAdmin() {

  return <Layout>
    <div className='flex flex-row flex-wrap place-content-center place-items-center flex-grow justify-center items-center gap-5 container'>
      <MainCard
        title="Тестирования"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Управление существующими тестированиями'}
        value={'/admin/tests'}
        className="shadow-md shadow-red-600"
      />
      <MainCard
        title="Сотрудники"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Управление, изменение и контроль сотрудников'}
        value={'/admin/users'}
        className="shadow-md shadow-red-600"
      />
      <MainCard
        title="База данных"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Управление состоянием базы данных'}
        value={'/admin/database'}
        className="shadow-md shadow-red-600"
      />
      <MainCard
        title="Статистика"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Просмотр общей статистики приложения'}
        value={'/admin/stats'}
        className="shadow-md shadow-red-600"
      />
      <MainCard
        title="Профиль"
        icon={<HiCursorClick className="text-red-600" />}
        helperText={'Просмотр информации о текущем пользователе'}
        value={'/admin/profile'}
        className="shadow-md shadow-red-600"
      />
    </div>
  </Layout>
}

