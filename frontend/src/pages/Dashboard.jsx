import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import {
  CircleCheck,
  CirclePlus,
  ClipboardList,
  BadgeCheck,
  CheckCheck,
  Trash,
  Layers,
  Zap,
} from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const { loading, error, tasks, fetchTasks, addTask, toggleTask, deleteTask } =
    useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks().catch(() => toast.error("Gagal memuat Task"));
  }, [fetchTasks]);

  const total = tasks.length;
  const selesai = tasks.filter((task) => task.is_completed).length;
  const progress = total - selesai;
  const preview = tasks.filter((task)=> !task.is_completed).slice(0, 5)

  async function handleAdd(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addTask(title, description);
      setTitle("");
      setDescription("");
      toast.success("Tugas Berhasil dibuat!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat task");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(task) {
    try {
      await toggleTask(task);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah status task");
    }
  }

  async function handleDelete(task) {
    try {
      await deleteTask(task.id);
      toast.success("Berhasil menghapus task");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus task");
    }
  }

  return (
    <>
      <header style={{position: "sticky", top: 0, zIndex : 1000}}>
        <Navbar />
      </header>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Selamat datang kembali, {user?.name}</h1>
          {progress === 0 ? (
            <p>Tidak ada tugas hari ini</p>
          ) : (
            <p>
              Ada {progress} tugas terjadwal hari ini. Dahulukan pekerjaan
              berdampak tinggi
            </p>
          )}
        </div>

        <div className="box-task">
          <div className="total-box">
            <div className="box-header">
              <div className="box-title">
                <h1>Total Tugas</h1>
                <p>Total semua tugas mu</p>
              </div>
              <div className="icon-box-total">
                <Layers size={20} />
              </div>
            </div>
            <span className="stat-number">{total}</span>
            <hr />
          </div>

          <div className="progress-box">
            <div className="box-header">
              <div className="box-title">
                <h1>In Progress</h1>
                <p>Kamu mempunyai {progress} tugas yang belum dikerjakan</p>
              </div>
              <div className="box-icon-progress">
                <Zap size={20} />
              </div>
            </div>

            <span className="stat-number">{progress}</span>
            <progress
              className="stat-progress"
              value={progress}
              max={total || 1}
              aria-label="Progres tugas berjalan"
            />
          </div>

          <div className="selesai-box">
            <div className="box-header">
              <div className="box-title">
                <h1>Completed</h1>
                <p>{selesai} tugas sudah kamu kerjakan</p>
              </div>
              <div className="box-icon-selesai">
                <BadgeCheck size={20} />
              </div>
            </div>

            <span className="stat-number">{selesai}</span>
            <progress
              className="stat-progress"
              value={selesai}
              max={total || 1}
              aria-label="Progres tugas selesai"
            />
          </div>
        </div>

        <div className="box-2">
          <form className="quick-add" onSubmit={handleAdd} method="post">
            <div className="header-form">
              <CircleCheck className="icon-header" size={48} />
              <div className="title-header">
                <h1>Quick Add</h1>
                <p>Bikin tugas baru secara instant</p>
              </div>
            </div>
            <hr />
            <label htmlFor="taskTitle">Task Title</label>
            <input
              type="text"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama Tugas"
              required
            />
            <label htmlFor="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi (optional)"
            />
            <button
              type="submit"
              className="btn-Quickadd"
              disabled={submitting}
            >
              {submitting ? (
                <ClipLoader
                  size={14}
                  color="#ffffff"
                  aria-label="Membuat task.."
                />
              ) : (
                <span>
                  <CirclePlus size={20} /> Buat Task
                </span>
              )}
            </button>
          </form>

          <div className="list-task">
            <div className="header-list">
              <h2>List Tugas</h2>
              <span>{total > 5 ? `${total}+` : `${total}`}</span>
            </div>
            <div className="task-content">
              {loading ? (
                <div className="skeleton-list" aria-label="Memuat task">
                  {[1, 2, 3].map((n) => (
                    <div className="skeleton-item" key={n} />
                  ))}
                </div>
              ) : error ? (
                <div className="loading-task">
                  <ClipboardList size={26} />
                  <h4>Gagal memuat tugas</h4>
                  <p>Periksa koneksi lalu muat ulang halaman</p>
                </div>
              ) : preview.length === 0 ? (
                <div className="loading-task">
                  <ClipboardList size={26} />
                  <h4>Belum ada tugas</h4>
                  <p>Buat tugas mu sekarang</p>
                </div>
              ) : (
                preview.map((task) => (
                  <div
                    className={`task-item ${task.is_completed ? "completed" : "active"}`}
                    key={task.id}
                  >
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <span
                        className={`task-status ${task.is_completed ? "completed" : "active"}`}
                      >
                        {task.is_completed ? "Completed" : "Active"}
                      </span>
                    </div>
                    <section className="content">
                      <div className="task-description">
                        <p>{task.description}</p>
                      </div>
                      <div className="btn-action">
                        <button
                          onClick={() => handleToggle(task)}
                          className={`${task.is_completed ? "btn-completed" : "btn-markCompleted"}`}
                          aria-label={
                            task.is_completed
                              ? `Tandai belum selesai: ${task.title}`
                              : `Tandai selesai: ${task.title}`
                          }
                        >
                          {task.is_completed ? (
                            <span>
                              <BadgeCheck size={18} /> Completed
                            </span>
                          ) : (
                            <span>
                              <CheckCheck size={18} /> Mark Complete
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="btn-deleteTask"
                          aria-label={`Hapus ${task.title}`}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </section>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default Dashboard;
