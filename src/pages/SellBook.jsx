import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Camera, Info } from 'lucide-react';
import { booksService } from '../services/books';
import { subjects, semesters, conditions } from '../data/mockData';
import Input, { Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const SellBook = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: '', subject: '', semester: '', condition: '', price: '', originalPrice: '', description: '', tags: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    valid.forEach(f => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let { width, height } = img;
          
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          setImages(imgs => imgs.length < 4 ? [...imgs, compressedBase64] : imgs);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(f);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Book title is required';
    if (!form.subject) e.subject = 'Select a subject';
    if (!form.semester) e.semester = 'Select semester';
    if (!form.condition) e.condition = 'Select condition';
    if (!form.price || isNaN(form.price) || form.price <= 0) e.price = 'Enter a valid price';
    if (!form.description.trim()) e.description = 'Add a description';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      await booksService.create({ ...form, images });
      toast.success('🎉 Your book is now listed!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to list book');
    } finally {
      setLoading(false);
    }
  };

  const discount = form.price && form.originalPrice
    ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">List a Book for Sale</h1>
          <p className="text-slate-500 mt-1">Fill in the details below to list your book on CampusConnect</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera size={18} className="text-primary-600" />
                  Book Photos
                  <span className="text-xs text-slate-400 font-normal ml-1">Up to 4 images</span>
                </h2>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => images.length < 4 && fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                    ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}`}
                >
                  <Upload size={32} className={`mx-auto mb-3 ${dragOver ? 'text-primary-500' : 'text-slate-300'}`} />
                  <p className="text-sm font-medium text-slate-600">
                    {dragOver ? 'Drop images here!' : 'Drag & drop images or click to upload'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB each</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleFiles(e.target.files)}
                  />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-square">
                        <img src={img} alt={`preview-${i}`} className="w-full h-full object-cover rounded-xl" />
                        {i === 0 && <span className="absolute top-1 left-1 bg-primary-700 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">Cover</span>}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImages(imgs => imgs.filter((_, j) => j !== i)); }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {images.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 hover:border-primary-300 hover:text-primary-400 transition-colors"
                      >
                        <Upload size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
                <h2 className="font-semibold text-slate-900 mb-1">Book Information</h2>

                <Input
                  label="Book Title"
                  required
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  placeholder="e.g. Engineering Mathematics Vol. 1"
                  error={errors.title}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Dropdown
                    label="Subject"
                    required
                    options={subjects}
                    value={form.subject}
                    onChange={v => update('subject', v)}
                    placeholder="Select subject"
                    searchable
                    error={errors.subject}
                  />
                  <Dropdown
                    label="Semester"
                    required
                    options={semesters}
                    value={form.semester}
                    onChange={v => update('semester', v)}
                    placeholder="Select semester"
                    error={errors.semester}
                  />
                </div>

                <Dropdown
                  label="Book Condition"
                  required
                  options={conditions}
                  value={form.condition}
                  onChange={v => update('condition', v)}
                  placeholder="Select condition"
                  error={errors.condition}
                />

                <Textarea
                  label="Description"
                  required
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Describe the book condition, any highlights, missing pages, edition, etc."
                  rows={4}
                  error={errors.description}
                  hint="Be honest about the condition — it builds trust with buyers"
                />

                <Input
                  label="Tags"
                  value={form.tags}
                  onChange={e => update('tags', e.target.value)}
                  placeholder="e.g. engineering, math, calculus (comma separated)"
                  hint="Tags help buyers find your book easily"
                />
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Pricing</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Selling Price (₹)"
                    required
                    type="number"
                    value={form.price}
                    onChange={e => update('price', e.target.value)}
                    placeholder="e.g. 250"
                    error={errors.price}
                  />
                  <Input
                    label="Original MRP (₹)"
                    type="number"
                    value={form.originalPrice}
                    onChange={e => update('originalPrice', e.target.value)}
                    placeholder="e.g. 800"
                    hint="Optional — helps buyers see the savings"
                  />
                </div>
                {discount > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-xl">
                    <Info size={14} />
                    Buyers save <strong>{discount}%</strong> vs MRP — great deal!
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" loading={loading} className="w-full">
                {loading ? 'Listing your book...' : '🚀 List Book for Sale'}
              </Button>
            </form>
          </motion.div>

          {/* Preview Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider text-slate-500">Live Preview</h3>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="h-48 bg-slate-100 relative">
                  {images[0] ? (
                    <img src={images[0]} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Camera size={48} />
                    </div>
                  )}
                  {form.condition && (
                    <div className="absolute top-3 left-3">
                      <Badge condition={form.condition}>{form.condition}</Badge>
                    </div>
                  )}
                  {discount >= 20 && (
                    <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{discount}% OFF</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">
                    {form.title || 'Your book title appears here'}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {form.subject && <Badge variant="indigo">{form.subject}</Badge>}
                    {form.semester && <Badge variant="slate">{form.semester}</Badge>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-slate-900">
                        {form.price ? `₹${form.price}` : '₹--'}
                      </span>
                      {form.originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">₹{form.originalPrice}</span>
                      )}
                    </div>
                    <button className="bg-primary-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold">
                      Contact
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">📋 Listing Tips</h4>
                <ul className="space-y-1.5 text-xs text-blue-700">
                  <li>• Upload clear, well-lit photos</li>
                  <li>• Mention any highlighting or damage</li>
                  <li>• Price between 30–60% of MRP sells fastest</li>
                  <li>• Respond to buyers quickly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellBook;
