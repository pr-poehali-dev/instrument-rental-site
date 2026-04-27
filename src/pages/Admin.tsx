import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/e8dc8261-8236-4252-aa2d-74a038fc598d";
const UPLOAD_URL = "https://functions.poehali.dev/d3c8d5c2-27ed-4ce1-9e71-a65ca77d07d1";

const CATEGORIES = [
  "Электроинструмент",
  "Ручной инструмент",
  "Измерительный",
  "Строительное оборудование",
];

interface Tool {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
  description: string;
}

const emptyForm = (): Omit<Tool, "id"> => ({
  name: "",
  category: CATEGORIES[0],
  price: 0,
  available: true,
  image: "",
  description: "",
});

export default function Admin() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm());

  // image upload
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // delete confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTools = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      setTools(data);
    } catch {
      setError("Не удалось загрузить инструменты");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setImagePreview("");
    setError("");
    setModalOpen(true);
  };

  const openEdit = (tool: Tool) => {
    setEditingId(tool.id);
    setForm({
      name: tool.name,
      category: tool.category,
      price: tool.price,
      available: tool.available,
      image: tool.image,
      description: tool.description,
    });
    setImagePreview(tool.image || "");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setImagePreview("");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);

      try {
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: dataUrl, name: file.name, type: file.type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
        setForm((prev) => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить фото");
        setImagePreview("");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      setError("Название и категория обязательны");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Ошибка сохранения");
      }
      setSuccess(editingId ? "Инструмент обновлён" : "Инструмент добавлен");
      closeModal();
      await fetchTools();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка удаления");
      setSuccess("Инструмент удалён");
      setDeleteId(null);
      await fetchTools();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Не удалось удалить инструмент");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-foreground">
              <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                <Icon name="Wrench" size={16} className="text-background" />
              </div>
              ПроИнструмент
            </a>
            <span className="hidden sm:block text-muted-foreground">/</span>
            <span className="hidden sm:block text-sm font-semibold text-muted-foreground">Панель управления</span>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            На сайт
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Title + Add button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground">Инструменты</h1>
            <p className="text-muted-foreground mt-1">
              {loading ? "Загрузка..." : `${tools.length} позиций в каталоге`}
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2"
          >
            <Icon name="Plus" size={16} />
            Добавить
          </Button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
            <Icon name="AlertCircle" size={16} />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
              <Icon name="X" size={14} />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
            <Icon name="CheckCircle" size={16} />
            {success}
          </div>
        )}

        {/* Tools table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Загружаем инструменты...</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Icon name="PackageOpen" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg font-medium">Каталог пуст</p>
            <p className="text-muted-foreground text-sm mt-1">Добавьте первый инструмент</p>
            <Button
              onClick={openCreate}
              className="mt-6 bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2"
            >
              <Icon name="Plus" size={16} />
              Добавить инструмент
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Инструмент</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Категория</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Цена / сут</th>
                    <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Статус</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {tools.map((tool, i) => (
                    <tr
                      key={tool.id}
                      className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/10"}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                            {tool.image ? (
                              <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon name="Wrench" size={16} className="text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-foreground leading-snug">{tool.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{tool.category}</td>
                      <td className="px-4 py-4 text-right font-bold text-foreground">{tool.price} ₽</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                            tool.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {tool.available ? "В наличии" : "Занят"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEdit(tool)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            title="Редактировать"
                          >
                            <Icon name="Pencil" size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(tool.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {tools.map((tool) => (
                <div key={tool.id} className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                    {tool.image ? (
                      <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Wrench" size={18} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm leading-snug truncate">{tool.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-foreground">{tool.price} ₽/сут</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          tool.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tool.available ? "В наличии" : "Занят"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(tool)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(tool.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===== ADD / EDIT MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
              <h2 className="text-xl font-black text-foreground">
                {editingId ? "Редактировать инструмент" : "Новый инструмент"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Название <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Перфоратор Bosch GBH 2-26"
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Категория <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Price + Available */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Цена, ₽/сутки
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Доступность</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, available: !form.available })}
                    className={`w-full flex items-center justify-center gap-2 border rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      form.available
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    <Icon name={form.available ? "CheckCircle" : "XCircle"} size={15} />
                    {form.available ? "В наличии" : "Занят"}
                  </button>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Фотография</label>
                <label
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    uploading
                      ? "border-border bg-secondary/30 cursor-wait"
                      : "border-border hover:border-foreground/40 hover:bg-secondary/30"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-48 object-cover rounded-xl"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 hover:bg-black/30 transition-colors group">
                        <span className="hidden group-hover:flex items-center gap-1.5 text-white text-sm font-semibold">
                          <Icon name="RefreshCw" size={15} />
                          Заменить фото
                        </span>
                      </div>
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                      {uploading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">Загружаем фото...</p>
                        </>
                      ) : (
                        <>
                          <Icon name="ImagePlus" size={28} className="text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">Нажмите, чтобы выбрать фото</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG, WebP — до 5 МБ</p>
                        </>
                      )}
                    </div>
                  )}
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Описание</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Краткое описание инструмента..."
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <Icon name="AlertCircle" size={15} />
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                variant="outline"
                onClick={closeModal}
                className="flex-1 font-semibold"
                disabled={saving}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2"
                disabled={saving || uploading}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Загрузка фото...
                  </>
                ) : saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={15} />
                    {editingId ? "Сохранить" : "Добавить"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Icon name="Trash2" size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Удалить инструмент?</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Это действие нельзя отменить</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="flex-1 font-semibold"
                disabled={deleting}
              >
                Отмена
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Icon name="Trash2" size={15} />
                    Удалить
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}