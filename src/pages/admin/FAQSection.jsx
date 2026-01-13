import React, { useState, useEffect } from "react";
import { getFAQs } from '../../api/Public/faq';       // ✅ public API
import { addFAQ, updateFAQ, deleteFAQ } from '../../api/Admin/faq'; // ✅ admin APIs

// Assets
import EditIcon from "../../assets/icons/edit.svg";
import DeleteIcon from "../../assets/icons/deleteIcon.svg";
import cross from "../../assets/icons/cross.svg";
import PlusButton from "../../assets/buttons/PlusButton.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import RightIcon from "../../assets/buttons/RightIcon.svg";

const FAQs = () => {
  const [faqList, setFaqList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editFaqs, setEditFaqs] = useState([]);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await getFAQs();
      setFaqList(res.data || []);
    } catch (e) {
      setFaqList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditFaqs(faqList.map(faq => ({ ...faq })));
    setIsEditing(true);
  };

  const handleSave = async () => {
    await Promise.all(editFaqs.map(async (faq) => {
      const ques = faq.ques ?? faq.question;
      const ans = faq.ans ?? faq.answer;
      if (faq.id) {
        await updateFAQ(faq.id, { ques, ans });
      } else if (ques && ans) {
        await addFAQ({ ques, ans });
      }
    }));
    setIsEditing(false);
    fetchFaqs();
  };

  const handleAddNew = () => {
    setEditFaqs([...editFaqs, { ques: '', ans: '' }]);
  };

  const handleDelete = async (id) => {
    if (!id) {
      setEditFaqs(editFaqs.filter(faq => faq.id !== id));
      return;
    }
    await deleteFAQ(id);
    setEditFaqs(editFaqs.filter(faq => faq.id !== id));
    fetchFaqs();
  };

  const handleDeleteAll = async () => {
    await Promise.all(faqList.map(faq => deleteFAQ(faq.id)));
    fetchFaqs();
  };

  return (
    <div className="w-full h-full text-white p-4 sm:p-6 flex flex-col">
      {/* Header */}
      <div className="bg-[#8E8E8E] text-white rounded-t-xl px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">FAQ's</h2>
        <div className="flex gap-2 items-center text-sm">
          <span>Page</span>
          <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-xs font-medium cursor-pointer">
            FAQ
          </button>
        </div>
      </div>

      {/* FAQ list */}
      <div className="flex-1 overflow-y-auto bg-black scrollbar-hide divide-y divide-gray-700" style={{ maxHeight: "60vh" }}>
        <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
        {loading ? (
          <div className="px-6 py-6">Loading...</div>
        ) : faqList.length === 0 ? (
          <div className="px-6 py-6">No FAQs found.</div>
        ) : (
          faqList.map((faq, index) => (
            <div key={faq.id} className="px-6 py-6">
              <h3 className="font-bold text-white mb-1">{index + 1}. {faq.ques ?? faq.question}</h3>
              <p className="text-sm text-gray-400">{faq.ans ?? faq.answer}</p>
            </div>
          ))
        )}
      </div>

      {/* Footer Buttons */}
      <div className="w-full h-[73px] flex justify-end gap-5 px-7 bg-[#30303099]/60" style={{ fontSize: 16, fontWeight: 600 }}>
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-[#1a1a1a] w-[900px] max-h-[70vh] rounded-xl shadow-lg border border-[#5a5a5a] flex flex-col cursor-default">
              {/* Edit Header */}
              <div className="h-[60px] w-full flex justify-between items-center px-7 bg-[#8E8E8E] rounded-t-xl">
                <h2 className="text-[#333333]" style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 600 }}>Edit FAQs</h2>
                <div className="h-[30px] w-[30px] cursor-pointer rounded-sm p-1.5 bg-[#333333] flex items-center justify-center" onClick={() => setIsEditing(false)}>
                  <img src={cross} alt="close" className="h-[20px] w-[20px]" />
                </div>
              </div>

              {/* FAQ Edit Fields */}
              <div className="overflow-y-auto px-6 py-4 flex-1 scrollbar-hide" style={{ maxHeight: "70vh", overscrollBehavior: "contain" }}>
                {editFaqs.map((item, idx) => (
                  <div key={item.id || `new-${idx}`} className="flex mb-5">
                    <div className="flex-1 py-3 px-7 gap-1">
                      <label className="block text-sm text-gray-300 mb-1">QUESTION</label>
                      <input
                        type="text"
                        value={item.ques ?? item.question}
                        onChange={(e) => {
                          const updated = [...editFaqs];
                          updated[idx].ques = e.target.value;
                          setEditFaqs(updated);
                        }}
                        placeholder="FAQ Question"
                        className="faq-input w-full font-mono px-3 py-2 rounded-md text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)]"
                      />
                      <label className="block text-sm text-gray-300 mt-2">ANSWER</label>
                      <textarea
                        value={item.ans ?? item.answer}
                        onChange={(e) => {
                          const updated = [...editFaqs];
                          updated[idx].ans = e.target.value;
                          setEditFaqs(updated);
                        }}
                        placeholder="FAQ Answer"
                        className="faq-input w-full mt-1 h-[100px] px-3 py-2 rounded-md font-mono text-white [box-shadow:inset_3px_3px_8px_rgba(255,255,255,0.3)] scrollbar-hide"
                        style={{ resize: 'none', overflow: 'hidden' }}
                      ></textarea>
                    </div>
                    <div className="flex flex-col justify-center">
                      <button onClick={() => handleDelete(item.id)} className="w-[40px] h-[40px] cursor-pointer rounded-xl bg-[#ACACAC40]/60 hover:bg-[#ACACAC40]/100 flex items-center justify-center mb-20">
                        <img src={deleteIcon} alt="delete" className="h-[20px] w-[20px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-2 bg-[#30303099]/30 rounded-b-xl border-t border-[#5a5a5a]">
                <button onClick={handleSave} className="p-2 rounded-xl border-[2px] cursor-pointer bg-[#ACACAC40]/60 hover:bg-[#ACACAC40]/100 border-[#FFFFFF] flex items-center justify-center gap-2 text-white px-4">
                  <img src={RightIcon} alt="save" className="h-[25px] w-[25px]" />
                  <p>SAVE</p>
                </button>
                <button onClick={handleAddNew} className="p-2 rounded-xl border-[2px] cursor-pointer bg-[#ACACAC40]/60 hover:bg-[#ACACAC40]/100 border-[#FFFFFF] flex items-center justify-center gap-2 text-white px-4">
                  <img src={PlusButton} alt="add new" className="h-[25px] w-[25px]" />
                  <p>ADD NEW</p>
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleEdit} className="w-[105px] h-[45px] mt-3 rounded-xl border-[2px] cursor-pointer bg-[#ACACAC40]/60 hover:bg-[#ACACAC40]/100 border-[#FFFFFF] flex items-center justify-center gap-2 text-white px-4">
          <img src={EditIcon} alt="edit" className="h-[25px] w-[25px]" />
          <p>EDIT</p>
        </button>
        <button onClick={handleDeleteAll} className="w-[125px] h-[45px] mt-3 rounded-xl border-[2px] cursor-pointer bg-[#ACACAC40]/60 hover:bg-[#ACACAC40]/100 border-[#FFFFFF] flex items-center justify-center gap-2 text-white px-3">
          <img src={DeleteIcon} alt="delete" className="h-[25px] w-[25px]" />
          <p>DELETE</p>
        </button>
      </div>
    </div>
  );
};

export default FAQs;
