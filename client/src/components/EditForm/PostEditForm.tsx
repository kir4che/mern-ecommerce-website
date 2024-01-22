import { Dialog } from '@headlessui/react';
import InputWithLabel from '../ui/InputWithLabel';

const PostEditForm = ({ isAddOrEdit, setIsAddOrEdit, form, setForm, handleFormUpdate }) => {
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value });
  }

  return (
    <Dialog open={isAddOrEdit === 'edit' || isAddOrEdit === 'add'} className="relative z-50" onClose={() => { }}>
      <div className="fixed inset-0 flex items-center justify-center w-screen bg-primary/5">
        <Dialog.Panel className='max-w-xl w-full min-w-[400px] p-4 overflow-y-auto bg-white rounded-md max-h-[80%]'>
          <Dialog.Title className='flex items-center justify-between pb-2 border-b border-gray-300'>
            編輯最新消息
            <button className='hover:opacity-60' onClick={() => setIsAddOrEdit('')}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
              </svg>
            </button>
          </Dialog.Title>
          <Dialog.Description className='py-4 space-y-2 text-sm'>
            <InputWithLabel text='標題' name='title' value={form.title} onChange={handleFormChange} />
            <label className='block'>
              分類
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleFormChange}
                placeholder='活動'
              />
            </label>
            <InputWithLabel text='日期' name='date' value={form.date} onChange={handleFormChange} />
            <label className='block'>
              內容
              <textarea
                name="content"
                value={form.content}
                rows={12}
                onChange={handleFormChange}
              />
            </label>
            <InputWithLabel text='圖片網址' name='imageUrl' value={form.imageUrl} onChange={handleFormChange} placeholder='http://xxx.jpg' />
          </Dialog.Description>
          <div className='ml-auto text-sm w-fit'>
            <button className='px-2 py-1 rounded-md hover:bg-gray-100' onClick={() => handleFormUpdate('posts', isAddOrEdit)}>確定變更</button>
            <button className='px-2 py-1 rounded-md hover:bg-gray-100' onClick={() => setIsAddOrEdit('')}>取消</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )

}

export default PostEditForm