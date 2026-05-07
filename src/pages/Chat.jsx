import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, BookOpen, Phone, Video, MoreVertical, Smile, Paperclip, ArrowLeft } from 'lucide-react';
import { chatService } from '../services/chats';
import Avatar from '../components/ui/Avatar';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const data = await chatService.getConversations();
        setChats(data);
        if (data.length > 0) setActiveChat(data[0]);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const filteredChats = chats.filter(c =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectChat = (chat) => {
    setActiveChat(chat);
    setMobileView('chat');
    // Mark as read
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    
    try {
      const msg = await chatService.sendMessage(activeChat.id, newMessage.trim());
      const newMsg = { id: Date.now().toString(), senderId: 'current', text: msg.text, time: msg.time, date: new Date().toISOString().split('T')[0] };

      setChats(prev => prev.map(c =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastMessageTime: newMsg.time }
          : c
      ));
      setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen bg-slate-100 pt-16 flex flex-col">
      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full px-4 py-4 gap-4">
        {/* Conversation list */}
        <div className={`w-full md:w-80 bg-white rounded-2xl shadow-card flex flex-col overflow-hidden flex-shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Messages</h2>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-primary-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                <Search size={24} />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-slate-50 hover:bg-slate-50
                    ${activeChat?.id === chat.id ? 'bg-primary-50 border-r-2 border-r-primary-600' : ''}`}
                >
                  <Avatar name={chat.otherUser.name} online={chat.otherUser.isOnline} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-slate-900 text-sm truncate">{chat.otherUser.name}</p>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-1">{chat.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mb-1">{chat.lastMessage}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary-500 flex items-center gap-1">
                        <BookOpen size={10} />
                        <span className="truncate max-w-[140px]">{chat.bookTitle}</span>
                      </span>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 bg-primary-700 text-white text-xs rounded-full flex items-center justify-center font-bold">{chat.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className={`flex-1 bg-white rounded-2xl shadow-card flex flex-col overflow-hidden ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-white">
                <button className="md:hidden mr-1 text-slate-400 hover:text-slate-600" onClick={() => setMobileView('list')}>
                  <ArrowLeft size={20} />
                </button>
                <Avatar name={activeChat.otherUser.name} online={activeChat.otherUser.isOnline} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{activeChat.otherUser.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {activeChat.otherUser.isOnline
                      ? <><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Online</>
                      : <span className="text-slate-400">Last seen recently</span>
                    }
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"><Phone size={18} /></button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"><Video size={18} /></button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"><MoreVertical size={18} /></button>
                </div>
              </div>

              {/* Book reference */}
              <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <BookOpen size={13} />
                  <span className="font-medium">Regarding:</span>
                  <span className="truncate">{activeChat.bookTitle}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
                style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '0 0' }}>
                {activeChat.messages.map((msg, i) => {
                  const isMine = msg.senderId === 'current';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMine && <Avatar name={activeChat.otherUser.name} size="xs" className="mr-2 mt-auto flex-shrink-0" />}
                      <div className="max-w-[70%]">
                        <div className={isMine ? 'chat-bubble-sent' : 'chat-bubble-received'}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <p className={`text-xs text-slate-400 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-100 bg-white">
                <form onSubmit={sendMessage} className="flex items-end gap-2">
                  <button type="button" className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0">
                    <Paperclip size={18} />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                      placeholder="Type a message... (Enter to send)"
                      rows={1}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none transition-all"
                    />
                  </div>
                  <button type="button" className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0">
                    <Smile size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2.5 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={36} className="text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Select a conversation</h3>
                <p className="text-slate-400 text-sm">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
