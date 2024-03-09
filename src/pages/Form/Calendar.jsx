import { React, useState, useEffect } from "react";
import Calendar from "react-calendar";
import Layout from "../../partials/dashboard/Layout";
// import "react-calendar/dist/Calendar.css";
import "../../css/Calendar.css";
import { Button } from "@material-tailwind/react";
import { Modal } from "@material-ui/core";
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';


export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryContentsForSelectedDate, setDiaryContentsForSelectedDate] = useState([]);
  const [editStatus, setEditStatus] = useState({});
  const [editedEntries, setEditedEntries] = useState({});


  const { user } = useUser();

  

  const formatDate = (localDate) => {
    const year = localDate.getFullYear();
    const month = (1 + localDate.getMonth()).toString().padStart(2, "0");
    const day = localDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  

  const fetchDiaryList = (selectedDate) => {
    const formattedDate = formatDate(selectedDate); // 确保这里的 formatDate 函数返回的格式与后端期望的一致
    // axios.get(`/gettodaySessions/${user.id}?date=${formattedDate}`)
    axios.get(`https://mood-blog-backend-ruddy.vercel.app//gettodaySessions/${user.id}?date=${formattedDate}`)
      .then((res) => {
        console.log(res.data);
        setDiaryContentsForSelectedDate(res.data);
  
        // 由于这次请求仅获取选定日期的日记，可能不需要设置 highlightedDates
        // 但如果需要更新 highlightedDates，可以根据需求调整
  
        let initialEditStatus = {};
        res.data.forEach(entry => {
          initialEditStatus[entry.diaryId] = false;
        });
        setEditStatus(initialEditStatus);
      })
      .catch((err) => {
        console.log("Error fetching diary dates!", err);
      });
  };
  
  
  
  const saveEdits = (diaryId) => {
    const editedEntry = editedEntries[diaryId];
    axios.put(`https://mood-blog-backend-ruddy.vercel.app/modify/${diaryId}`, editedEntry)
    // axios.put(`http://localhost:3000/modify/${diaryId}`, editedEntry)
  .then(response => {
    // 处理成功响应
    console.log("日记更新成功", response.data);
    fetchDiaryList(date);
    // 其他处理逻辑...
  })
  .catch(error => {
    console.error("更新日记失败", error.response ? error.response.data : error);
    if (error.response && error.response.status === 404) {
      alert("日记未找到");
    } else if (error.response && error.response.status === 403) {
      alert("没有权限");
    } else {
      alert("更新日记时发生错误");
    }
  });

  };

  // const saveEdits = (diaryId) => {
  //   const { content, createdAt } = editedEntries[diaryId]; // 从状态中获取内容和创建时间
  //   axios.put(`http://localhost:3000/modify/${diaryId}`, { content, createdAt })
  //     .then(response => {
  //       console.log("日记更新成功", response.data);
  //       // 在这里可能需要重新获取该日期的所有日记来更新UI
  //       fetchDiaryList(new Date(createdAt)); // 重新获取日记列表，使用createdAt作为参数
  //     })
  //     .catch(error => {
  //       console.error("更新日记失败", error.response ? error.response.data : error);
  //       // 错误处理...
  //     });
  // };
  

  const toggleEdit = (diaryId) => {
    const isEditing = editStatus[diaryId];
    
    if (isEditing) {
      // 确定按钮被点击，保存更改
      saveEdits(diaryId);
      const updatedEntry = editedEntries[diaryId];
      console.log("保存更改", updatedEntry);
      // 这里添加保存到后端的代码
      // axios.post('/api/saveDiary', { diaryId, ...updatedEntry })
  
      // 将编辑状态切换为 false
      setEditStatus(prev => ({ ...prev, [diaryId]: false }));
    } else {
      // 修改按钮被点击，进入编辑模式
      setEditStatus(prev => ({ ...prev, [diaryId]: true }));
    }
  };
  
  
  const handleContentChange = (diaryId, content, createdAt) => {
    setEditedEntries(prev => ({
      ...prev,
      [diaryId]: {
        ...prev[diaryId],
        content: content,
        createdAt: createdAt, // 保存修改的日记的创建时间
      },
    }));
  };
  
  
  


  useEffect(() => {
    fetchDiaryList(date); // 根据当前选中的日期获取日记
  }, [user.id, date]); // 添加date作为依赖
  

  useEffect(() => {
    // 假设这是从后端获取日记内容的函数
    axios.get(`https://mood-blog-backend-ruddy.vercel.app/getAllSessions/${user.id}`)
    // axios.get(`http://localhost:3000/getAllSessions/${user.id}`)
      .then((res) => {
        console.log(res.data); 
        setDiaryContentsForSelectedDate(res.data);
        // 初始化编辑状态为false
        let initialEditStatus = {};
        res.data.forEach(entry => {
          initialEditStatus[entry.diaryId] = false;
        });
        setEditStatus(initialEditStatus);
      })
      .catch((err) => {
        console.log("Error fetching diary dates!", err);
      });
  }, [user.id]);

  function tileClass({ date, view }) {
    if (view === 'month' && highlightedDates.includes(formatDate(date))) {
      return 'highlighted-date';
    }
  }

  const searchDiaryHandler = (user, selectedDate) => {
    setLoading(true);
    axios.get(`https://mood-blog-backend-ruddy.vercel.app/getAllSessions/${user.id}`)
    // axios.get(`http://localhost:3000/getAllSessions/${user.id}`)
      .then((res) => {
        const filteredDiaries = res.data.filter(entry => entry.createdAt.includes(selectedDate));
        setDiaryContentsForSelectedDate(filteredDiaries);
        setIsModalOpen(true);
        setLoading(false);
      }).catch((err) => {
        console.log("Search diary error!", err);
        setLoading(false);
      })
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDiaryContentsForSelectedDate([]); // Clear diary content when closing the modal
  };

  return (
    <Layout>
      <div className="p-20 flex flex-col justify-center items-center">
        <div className='pt-8 pb-4 font-medium text-lg'>選擇日期，回顧以前的日記吧</div>
        <Calendar 
          onChange={setDate} 
          value={date}
          tileClassName={tileClass}
        />
        <div className="flex items-center mt-10">
          <Button
            className="mr-4"
            onClick={() => searchDiaryHandler(user, formatDate(date))}
          >
            查看日記
          </Button>
          <Modal
            open={isModalOpen}
            onClose={closeModal}
          >
            <div className="overflow-y-auto modal-content p-4 bg-white rounded-lg shadow-md w-1/2 mx-auto h-2/3 my-12">
              <div className="text-xl font-bold mb-4">{formatDate(date)} Diary Content</div>
              {diaryContentsForSelectedDate.map((entry, index) => (
  <div key={index} className="p-4 mb-4 border border-gray-300 rounded-lg relative">
    {/* <p className="text-gray-500">ID: {entry.diaryId}</p> */}
    <p className="text-gray-500">心情: {entry.mood}</p>
    <p className="text-gray-500">心情描述: {entry.description}</p>
    {editStatus[entry.diaryId] ? (
      <textarea
      value={editedEntries[entry.diaryId]?.content || entry.content}
      style={{ width: '80%', minHeight: '100px' }} // 直接在这里添加样式
      onChange={(e) => handleContentChange(entry.diaryId, e.target.value)}
    />
    
    ) : (
      <p className="text-gray-700">內容: {entry.content}</p>
    )}

    {/* 切换按钮显示 */}
    <div className="absolute right-2 bottom-2 flex">
      <button
        className="text-blue-500 hover:text-blue-700 mr-2"
        onClick={() => toggleEdit(entry.diaryId)}
      >
        {editStatus[entry.diaryId] ? "确定" : "修改"}
      </button>

      {/* 分享按钮 */}
      <button
        className="text-blue-500 hover:text-blue-700 mr-2"
        onClick={() => handleShare(entry.diaryId)}
      >
        分享
      </button>
    </div>
  </div>
))}



              <div className="mt-4 text-right">
                <button onClick={closeModal} className="text-blue-500 hover:text-blue-700">Close</button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}
