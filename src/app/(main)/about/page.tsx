import { Separator } from "@/components/ui/separator";
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
  {
    message: "Ошибка авторизации",
    actions: "Убедитесь, что логин и пароль указаны верно, а также, что пользователь зарегистрирован в системе",
  },
  {
    message: "Результаты не найдены",
    actions: "Убедитесь что параметры поиска совпадают с существующими элементами",
  },
  {
    message: "Успешно сохранено",
    actions: "Данные о добавленной записи сохранены успешно в базе данных",
  },
  {
    message: "Успешно изменено",
    actions: "Данные о добавленной записи изменены успешно в базе данных",
  },
]

export default function Page() {
  return <div className="container pt-4">
    <div className='flex justify-between'>
      <h2 className="text-4xl font-bold col-span-2">Справка о программе</h2>
    </div>
    <Separator className="my-6" />
    <h3 className='text-2xl font-semibold'>1. Назначение программы</h3>
    <p className='text-lg'><span className="px-4" />Данная программа предназначена для автоматизации обучения сотрудников иностранным языкам.Данная программа предназначена для автоматизации обучения сотрудников иностранным языкам.</p>
    <h3 className='text-2xl font-semibold'>2. Условия выполнения программы</h3>
    <p className='text-lg'><span className="px-4" />Для получения доступа к приложению необходимо иметь логин и пароль для входа.</p>
    <h3 className='text-2xl font-semibold'>3. Выполнение программы</h3>
    <p className='text-lg'><span className="px-4" />При запуске программы открывается страница авторизации, представленная на рисунке 1.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 1 Страница авторизации" src={'/image1.png'} width={200} height={500} />
        <p className='text-lg'>Рисунок 1 Страница авторизации</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />На ней в соответствующие поля необходимо вести ваш логин и пароль. После – нажать на кнопку «Войти в приложение».
      В зависимости от вашей роли будет произведено разграничение доступа к некоторым функциям. Рассмотрим каждую из них.
      Роль «Преподаватель» – страница списка тестирований представлена на рисунке 2.
    </p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 2 – Страница списка тестирований" src={'/image2.png'} width={500} height={200} />
        <p className='text-lg'>Рисунок 2 – Страница списка тестирований</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />После нажатия кнопки «Создать новое тестирование», будет открыто с формой добавления тестирования, представленной на рисунке 3.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 3 – Страница добавления тестирования" src={'/image3.png'} width={200} height={500} />
        <p className='text-lg'>Рисунок 3 Страница добавления тестирования</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />После нажатия кнопки «Сохранить» будет осуществлен переход на страницу работы с вопросами тестирования, представленной на рисунке 4.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 4 – Страница добавления тестирования" src={'/image4.png'} width={200} height={500} />
        <p className='text-lg'>Рисунок 4 - Страница добавления тестирования</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />После нажатия кнопки «Сохранить» будет осуществлен переход на страницу работы с вопросами тестирования, представленной на рисунке 5.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 5 – Страница работы с вопросами тестирования" src={'/image5.png'} width={500} height={200}  />
        <p className='text-lg'>Рисунок 5 - Страница работы с вопросами тестирования</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />Роль «Сотрудник» – страница списка тестирований представлена на рисунке 6.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 6 – Страница списка тестирований" src={'/image6.png'} width={500} height={200}  />
        <p className='text-lg'>Рисунок 6 - Страница списка тестирований</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />После нажатия кнопки «Пройти тестирование», будет открыто с формой прохождения тестирования, представленной на рисунке 7.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 7 – Страница прохождения тестирования" src={'/image7.png'} width={500} height={200} />
        <p className='text-lg'>Рисунок 7 - Страница прохождения тестирования</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />После прохождения тестирования, будет открыто окно с формой результатов тестирования, представленной на рисунке 8.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 8 – Страница результатов тестирования" src={'/image8.png'} width={500} height={200} />
        <p className='text-lg'>Рисунок 8 - Страница результатов тестирования</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />Роль «Администратор» – страница списка сотрудников представлена на рисунке 9.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 9 – Страница результатов тестирования" src={'/image9.png'} width={500} height={200} />
        <p className='text-lg'>Рисунок 9 - Страница результатов тестирования</p>
      </div>
    </div>
    <p className='text-lg'><span className="px-4" />После нажатия кнопки «Действие» и выбора кнопки «Изменить», будет открыто окно с формой изменения сотрудника, представленной на рисунке 10.</p>
    <div className='flex flex-grow justify-center'>
      <div className='flex justify-center flex-col'>
        <Image className='mr-auto ml-auto' alt="Рисунок 10 – " src={'/image10.png'} width={200} height={500} />
        <p className='text-lg'>Рисунок 10 - Страница прохождения тестирования</p>
      </div>
    </div>
    <h3 className='text-2xl font-semibold'>5. Сообщения оператору</h3>
    <p className='text-lg'>Сообщения оператору указаны в таблице 1.</p>
    <p className='text-lg'>Таблица 1 – Сообщения оператору</p>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Сообщение</TableHead>
          <TableHead>Описание действий при получении сообщения</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.message}>
            <TableCell>{item.message}</TableCell>
            <TableCell>{item.actions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
}