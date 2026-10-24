import Navbar from "../components/Navbar";
import { ClipLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  CheckCheck,
  CirclePlus,
  ClipboardList,
  Pencil,
  Trash,
  X,
  Search,
} from "lucide-react";

function Tasks() {
  const {
    loading,
    error,
    tasks,
    fetchTasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
  } = useTasks();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleRef = useRef(null);

  const total = tasks.length;
  const selesai = tasks.filter((task) => task.is_completed).length;
  const progress = total - selesai;

  // Filter status + pencarian judul/deskripsi, keduanya digabung
  const visibleTasks = tasks.filter((task) => {
    const matchFilter =
      filter === "all" ||
      (filter === "active" && !task.is_completed) ||
      (filter === "completed" && task.is_completed);
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      task.title.toLowerCase().includes(q) ||
      (task.description ?? "").toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  function closeModal() {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  }

  useEffect(() => {
    if (!isModalOpen) return;
    titleRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isModalOpen]);

  useEffect(() => {
    fetchTasks().catch(() => toast.error("Gagal memuat tugas"));
  }, [fetchTasks]);

  async function handleAdd(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addTask(title, description);
      setTitle("");
      setDescription("");
      setIsModalOpen(false);
      toast.success("Berhasil membuat tugas");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat tugas");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function handleEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await editTask(editingId, {
        title: editTitle,
        description: editDescription,
      });
      cancelEdit();
      toast.success("Tugas berhasil diupdate");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengupdate tugas");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task) {
    try {
      await toggleTask(task);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal mengubah status tugas",
      );
    }
  }

  async function handleDelete(task) {
    try {
      await deleteTask(task.id);
      if (editingId === task.id) cancelEdit();
      toast.success("Berhasil menghapus tugas");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus tugas");
    }
  }

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <h1>All Tasks</h1>
        <p>Kelola, Pantau, Atur tugas mu tanpa hambatan</p>

        <div className="header-tasks">
          <span className="search-tasks">
            <Search size={18} />
            <input
              type="search"
              aria-label="Cari tugas"
              placeholder="Cari tugas mu"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </span>
          <div
            className="btn-action"
            role="group"
            aria-label="Filter status tugas"
          >
            <button
              className={`btn-filter ${filter === "all" ? "is-active" : ""}`}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
            >
              All {total}
            </button>
            <button
              className={`btn-filter ${filter === "active" ? "is-active" : ""}`}
              onClick={() => setFilter("active")}
              aria-pressed={filter === "active"}
            >
              Active {progress}
            </button>
            <button
              className={`btn-filter ${filter === "completed" ? "is-active" : ""}`}
              onClick={() => setFilter("completed")}
              aria-pressed={filter === "completed"}
            >
              Completed {selesai}
            </button>
            <button
              className="btn-addTask"
              onClick={() => setIsModalOpen(true)}
            >
              <CirclePlus size={18} /> Tambah Task
            </button>
          </div>
        </div>

        <div className="list-task">
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
            ) : tasks.length === 0 ? (
              <div className="loading-task">
                <ClipboardList color="#1d4ed8" size={26} />
                <h4>Belum ada tugas</h4>
                <button
                  className="btn-addTask"
                  onClick={() => setIsModalOpen(true)}
                >
                  Buat tugas mu sekarang
                </button>
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="loading-task">
                <ClipboardList size={26} />
                <h4>Tidak ada tugas yang cocok</h4>
                <p>Coba kata kunci atau filter lain</p>
              </div>
            ) : (
              visibleTasks.map((task) => (
                <div
                  className={`task-item ${task.is_completed ? "completed" : "active"}`}
                  key={task.id}
                >
                  <div className="task-header">
                    <h3>{task.title} </h3>
                    {task.is_completed ? (
                      <span
                        className={`task-status ${task.is_completed ? "completed" : "active"}`}
                      >
                        Completed
                      </span>
                    ) : (
                      <span
                        className={`task-status ${task.is_completed ? "completed" : "active"}`}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  {editingId === task.id ? (
                    <form className="edit-task" onSubmit={handleEdit}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        aria-label="Edit judul tugas"
                        required
                        autoFocus
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        aria-label="Edit deskripsi tugas"
                        placeholder="Deskripsi (optional)"
                      />
                      <div className="btn-action">
                        <button
                          type="submit"
                          className="btn-markCompleted"
                          disabled={saving}
                        >
                          {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          type="button"
                          className="btn-modal-cancel"
                          onClick={cancelEdit}
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <section className="content">
                      <div className="task-description">
                        <p> {task.description} </p>
                      </div>
                      <div className="btn-action">
                        <button
                          onClick={() => handleToggle(task)}
                          className={`${task.is_completed ? "btn-completed" : "btn-markCompleted"}`}
                        >
                          {task.is_completed ? (
                            <span>
                              <BadgeCheck size={18} /> Completed
                            </span>
                          ) : (
                            <span>
                              {" "}
                              <CheckCheck size={18} /> Mark Complete{" "}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(task)}
                          className="btn-editTask"
                          aria-label={`Edit ${task.title}`}
                        >
                          <Pencil size={18} />
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
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="modal-box"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-add-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 id="modal-add-title">Tambah Task</h2>
                <button
                  className="modal-close"
                  onClick={closeModal}
                  aria-label="Tutup form tambah task"
                >
                  <X size={18} />
                </button>
              </div>
              <form className="modal-form" onSubmit={handleAdd}>
                <label htmlFor="taskTitle">Task Title</label>
                <input
                  ref={titleRef}
                  type="text"
                  id="taskTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nama tugas"
                  required
                />
                <label htmlFor="taskDescription">Description</label>
                <textarea
                  id="taskDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi (optional)"
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={closeModal}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ClipLoader
                        size={14}
                        color="#ffffff"
                        aria-label="Membuat task"
                      />
                    ) : (
                      <span>
                        <CirclePlus size={18} /> Buat Task
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Tasks;
