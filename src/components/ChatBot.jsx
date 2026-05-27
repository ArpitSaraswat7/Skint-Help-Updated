import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Minimize2, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── Knowledge Base ──────────────────────────────────────────────────────────

const KB = [
    {
        id: 'greeting',
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy', 'sup', 'greetings', 'hiya'],
        response: "Hi there! 👋 I'm Skint, your Skint Help assistant. I can help you with:\n\n• Donating surplus food as a restaurant\n• Volunteering as a food delivery driver\n• Finding food assistance near you\n• Joining our platform\n• Any questions about how we work",
        quickReplies: ['How does it work?', 'I want to donate food', 'I want to volunteer', 'I need food help'],
    },
    {
        id: 'how_it_works',
        patterns: ['how does it work', 'how it works', 'explain', 'tell me more', 'what is this', 'what do you do', 'about skint', 'what is skint help', 'overview', 'process'],
        response: "Skint Help connects surplus food to people in need through a simple 4-step process:\n\n🍽️ **Restaurants** notify us about leftover food\n📦 **Collection Centers** receive, sort & store it safely\n🚗 **Volunteers** deliver meals to those in need\n📊 **Every meal** is tracked so you can see your impact\n\nWe've already saved 50,000+ meals across 25 cities!",
        quickReplies: ['Join as a restaurant', 'Become a volunteer', 'Find food near me', 'See our impact'],
        link: { label: 'Full How It Works', path: '/how-it-works' },
    },
    {
        id: 'donate_food',
        patterns: ['donate food', 'donate', 'restaurant', 'surplus food', 'leftover food', 'food donation', 'restaurant portal', 'partner restaurant', 'restaurant partner', 'i have food', 'excess food', 'food waste'],
        response: "That's amazing — thank you for wanting to donate! 🍽️\n\nAs a **Restaurant Partner** you get:\n✅ Easy online donation scheduling\n✅ Tax deduction documentation\n✅ Real-time pickup tracking\n✅ Monthly impact reports\n✅ Reduced waste disposal costs\n\nTo get started, apply through our Join Us page and our team will onboard you within 24 hours.",
        quickReplies: ['Apply now', 'How to login to restaurant portal', 'What food can I donate?'],
        link: { label: 'Apply as Restaurant', path: '/join-us' },
    },
    {
        id: 'volunteer',
        patterns: ['volunteer', 'driver', 'deliver', 'worker', 'volunteer portal', 'pickup food', 'delivery', 'become volunteer', 'join as volunteer', 'worker portal', 'help deliver', 'drive'],
        response: "Awesome — volunteers are the heart of Skint Help! 🚗\n\nAs a **Volunteer Driver** you get:\n✅ Flexible scheduling — work when you want\n✅ Optimised delivery routes\n✅ Volunteer reward points\n✅ Hour tracking & certificates\n✅ Real impact on your community\n\nApply through Join Us and we'll verify you within 48 hours.",
        quickReplies: ['Apply to volunteer', 'How to login to volunteer portal', 'What is the commitment?'],
        link: { label: 'Apply as Volunteer', path: '/join-us' },
    },
    {
        id: 'need_food',
        patterns: ['need food', 'hungry', 'food assistance', 'free food', 'get food', 'i need food', 'food help', 'find food', 'customer portal', 'public portal', 'where to get food', 'food near me', 'collection center near me', 'receive food'],
        response: "We're here to help. 💚\n\nYou can find food near you through our **Food Map** — it shows all active collection centers in your area with opening hours and availability.\n\nYou can also sign in to our Customer Portal to request food assistance directly.",
        quickReplies: ['Open Food Map', 'Sign in for assistance', 'Find a collection center'],
        link: { label: 'Open Food Map', path: '/food-map' },
    },
    {
        id: 'collection_centers',
        patterns: ['collection center', 'centers', 'center', 'storage', 'where is', 'location', 'address', 'nearby', 'close to', 'food map', 'map', 'find center'],
        response: "Our **Collection Centers** are spread across 25 cities! 📍\n\nEach center:\n• Receives food from partner restaurants\n• Sorts & safely stores donations\n• Distributes to people in need\n• Is verified and supervised\n\nUse our Food Map to find the nearest center with live availability.",
        quickReplies: ['Open Food Map', 'Become a collection center'],
        link: { label: 'View Food Map', path: '/food-map' },
    },
    {
        id: 'join_center',
        patterns: ['collection center partner', 'run a center', 'open a center', 'manage a center', 'center partner', 'host a center'],
        response: "Want to run a Collection Center? We'd love to have you! 🏢\n\nAs a **Collection Center Partner** you get:\n✅ Inventory management system\n✅ QR code verification tools\n✅ Analytics dashboard\n✅ Full training & support\n✅ Community leadership recognition\n\nApply through our Join Us page.",
        quickReplies: ['Apply as a center'],
        link: { label: 'Apply as Center', path: '/join-us' },
    },
    {
        id: 'apply',
        patterns: ['apply', 'join', 'sign up', 'register', 'join us', 'get started', 'onboard', 'become a partner', 'how to join'],
        response: "Ready to make a difference? 🎉\n\nYou can join Skint Help as:\n🍽️ **Restaurant Partner** — donate surplus food\n🚗 **Volunteer Driver** — deliver meals\n🏢 **Collection Center** — manage distributions\n\nFill out the form on our Join Us page and we'll be in touch within 24-48 hours!",
        quickReplies: ['Open Join Us page', 'What happens after I apply?'],
        link: { label: 'Join Us Now', path: '/join-us' },
    },
    {
        id: 'after_apply',
        patterns: ['after apply', 'what happens after', 'application process', 'how long', 'review time', 'approval', 'next steps after applying'],
        response: "Here's what happens after you apply:\n\n1️⃣ We review your application (24-48 hrs)\n2️⃣ Our team contacts you via email\n3️⃣ Quick onboarding call (15 min)\n4️⃣ Account created & portal access given\n5️⃣ You start making an impact! 🎉\n\nCheck your email inbox (and spam) for our response.",
        quickReplies: ['Contact the team', 'Apply now'],
    },
    {
        id: 'login',
        patterns: ['login', 'sign in', 'log in', 'access portal', 'my account', 'password', 'forgot password', 'portal access', 'dashboard'],
        response: "To access your portal:\n\n1. Click **Sign In** in the top navigation\n2. Select your portal type (Restaurant / Volunteer / Customer)\n3. Enter your registered email & password\n\nIf you haven't registered yet, apply through Join Us first. If you forgot your password, use the 'Forgot Password' link on the login page.",
        quickReplies: ['Go to login', 'I need to apply first'],
        link: { label: 'Sign In', path: '/select-role' },
    },
    {
        id: 'food_types',
        patterns: ['what food', 'which food', 'type of food', 'food types', 'can i donate', 'what can be donated', 'acceptable food', 'food quality'],
        response: "We accept most types of surplus food:\n\n✅ Cooked meals (vegetarian & non-veg)\n✅ Packaged/sealed food items\n✅ Fresh produce & vegetables\n✅ Bakery items (same-day)\n✅ Dairy products (within date)\n\n❌ We cannot accept:\n• Expired food\n• Alcohol\n• Raw meat without proper storage\n\nAll food is quality-checked at collection centers.",
        quickReplies: ['Donate food as a restaurant', 'Find a collection center'],
    },
    {
        id: 'impact',
        patterns: ['impact', 'stats', 'statistics', 'how many', 'numbers', 'meals saved', 'cities', 'volunteers', 'restaurants count', 'success rate', 'achievements', 'results'],
        response: "Here's the impact Skint Help has made so far 📊\n\n🍽️ **50,000+** meals saved from waste\n👥 **15,000+** people fed\n🏪 **500+** restaurant partners\n🚗 **1,000+** active volunteers\n📍 **25** cities covered\n✅ **98%** success rate\n🌱 **120 tons** of carbon footprint reduced\n\nAnd we're growing every day!",
        quickReplies: ['See full impact page', 'Join the mission'],
        link: { label: 'View Impact Page', path: '/impact' },
    },
    {
        id: 'contact',
        patterns: ['contact', 'reach out', 'get in touch', 'email', 'phone', 'support', 'help', 'talk to someone', 'human', 'team', 'customer service'],
        response: "Need to talk to a real person? We're happy to help! 💬\n\nYou can reach us through our **Contact Page** where you can send a message directly to our team.\n\nWe typically respond within a few hours on business days.",
        quickReplies: ['Open contact page'],
        link: { label: 'Contact Us', path: '/contact' },
    },
    {
        id: 'qr_code',
        patterns: ['qr code', 'qr', 'scan', 'verify', 'verification', 'packet code'],
        response: "Each food packet gets a unique **QR code** when created by a restaurant.\n\nVolunteers scan this QR code to:\n✅ Verify the packet at pickup\n✅ Confirm arrival at the center\n✅ Track the full chain of custody\n\nThis ensures full transparency and accountability for every donation!",
        quickReplies: ['How to donate food', 'How to volunteer'],
    },
    {
        id: 'tax',
        patterns: ['tax', 'tax benefit', 'tax deduction', 'write off', 'tax receipt', 'financial benefit', 'cost saving'],
        response: "Yes! Restaurant partners receive **tax benefits** for their food donations 💰\n\nSkint Help provides:\n📄 Donation receipts for every packet\n📊 Monthly summary reports\n✅ Documentation for tax filing\n\nMany partners save significantly on both waste disposal costs AND taxes. It's a win-win!",
        quickReplies: ['Join as a restaurant', 'Contact for details'],
    },
    {
        id: 'safety',
        patterns: ['safe', 'safety', 'hygienic', 'hygiene', 'clean', 'quality check', 'food safety', 'is it safe', 'standards'],
        response: "Food safety is our top priority 🛡️\n\nOur standards:\n✅ All food checked for quality at collection\n✅ Temperature-controlled storage where needed\n✅ Trained staff at every center\n✅ Clear expiry and preparation date tracking\n✅ Regular center inspections\n\nWe follow all local food safety regulations.",
        quickReplies: ['Learn more about collection centers', 'How it works'],
    },
    {
        id: 'free',
        patterns: ['free', 'cost', 'price', 'fee', 'charge', 'how much', 'paid', 'subscription', 'payment'],
        response: "Skint Help is completely **free** for everyone! 🎉\n\n• Free for restaurants to donate\n• Free for volunteers to join\n• Free for people in need\n• Free for collection centers\n\nWe're a community-driven platform focused on impact, not profit.",
        quickReplies: ['Join the platform', 'How does it work?'],
    },
    {
        id: 'thanks',
        patterns: ['thank you', 'thanks', 'thank u', 'thx', 'ty', 'great', 'awesome', 'helpful', 'perfect', 'brilliant'],
        response: "You're so welcome! 😊 It's what we're here for.\n\nIs there anything else I can help you with? Together we can end food waste and feed communities! 💚",
        quickReplies: ['How does it work?', 'Join the platform', 'Contact the team'],
    },
    {
        id: 'restaurant_dashboard',
        patterns: ['restaurant dashboard', 'restaurant portal features', 'restaurant account', 'manage donations', 'create food packet', 'food packet', 'donation history'],
        response: "The **Restaurant Dashboard** gives you full control 🍽️\n\n📦 **Create Food Packets** — log surplus food with details & QR code\n📋 **Donation History** — track every packet you've submitted\n🏢 **Collection Centers** — see nearby centers & their availability\n📊 **Impact Stats** — view your total meals saved\n\nLog in at the Restaurant Portal to get started.",
        quickReplies: ['Go to login', 'How to donate food', 'What food can I donate?'],
        link: { label: 'Restaurant Login', path: '/select-role' },
    },
    {
        id: 'worker_dashboard',
        patterns: ['worker dashboard', 'volunteer dashboard', 'pickup task', 'assigned pickups', 'distribution', 'my pickups', 'delivery task', 'worker features'],
        response: "The **Volunteer Portal** makes delivering easy 🚗\n\n✅ **Pickups** — view & claim available pickup tasks near you\n✅ **Distributions** — confirm deliveries to collection centers\n✅ **Scan QR** — verify food packets at pickup & drop-off\n✅ **Track Hours** — your volunteer hours are logged automatically\n\nLog in to your Worker Portal to see live tasks.",
        quickReplies: ['Go to login', 'Become a volunteer', 'How does it work?'],
        link: { label: 'Worker Login', path: '/select-role' },
    },
    {
        id: 'food_map_usage',
        patterns: ['how to use food map', 'use the map', 'find on map', 'map help', 'public food map', 'open map', 'see centers on map'],
        response: "The **Food Map** is open to everyone — no account needed! 🗺️\n\nHow to use it:\n1. Go to the Food Map page\n2. Allow location access (or search your city)\n3. See nearby collection centers with live status\n4. Click any pin to see opening hours & available food\n\nIt updates in real-time so you always see current availability.",
        quickReplies: ['Open Food Map', 'Find a collection center', 'I need food help'],
        link: { label: 'Open Food Map', path: '/food-map' },
    },
    {
        id: 'volunteer_commitment',
        patterns: ['commitment', 'hours required', 'minimum hours', 'how often', 'part time', 'full time volunteer', 'time commitment', 'flexible'],
        response: "Volunteering with Skint Help is **100% flexible** 🙌\n\n• No minimum hours required\n• Work whenever you're available\n• Accept only the pickups you can handle\n• Pause anytime — no penalties\n\nMost volunteers do 2-5 hours per week but you set your own schedule!",
        quickReplies: ['Apply to volunteer', 'How does it work?'],
        link: { label: 'Apply as Volunteer', path: '/join-us' },
    },
    {
        id: 'privacy',
        patterns: ['privacy', 'data', 'personal info', 'gdpr', 'data protection', 'secure', 'my data', 'information safe'],
        response: "Your privacy is important to us 🔒\n\n• We only collect data needed to run the platform\n• Your personal info is never sold to third parties\n• All data is encrypted and stored securely\n• You can request data deletion at any time\n\nFor full details, contact us through the Contact page.",
        quickReplies: ['Contact the team', 'How does it work?'],
        link: { label: 'Contact Us', path: '/contact' },
    },
    {
        id: 'ngo_partner',
        patterns: ['ngo', 'charity', 'organisation', 'organization', 'partner ngo', 'nonprofit', 'food bank', 'shelter', 'community center'],
        response: "We love partnering with NGOs and community organisations! 🤝\n\nIf your organisation distributes food or supports people in need, we can:\n• Supply food donations from our network\n• Connect you with our volunteer drivers\n• Provide real-time stock tracking\n\nReach out via our Contact page and we'll set up a call.",
        quickReplies: ['Contact the team', 'Join the platform'],
        link: { label: 'Contact Us', path: '/contact' },
    },
    {
        id: 'app_mobile',
        patterns: ['app', 'mobile app', 'android', 'ios', 'download', 'phone app', 'play store', 'app store'],
        response: "Currently Skint Help runs as a **web platform** accessible on any device 📱💻\n\nOur site is fully mobile-optimised — just open it in your phone browser and it works like an app!\n\nA dedicated mobile app is on our roadmap. Stay tuned! 🚀",
        quickReplies: ['How does it work?', 'Join the platform'],
    },
    {
        id: 'bye',
        patterns: ['bye', 'goodbye', 'see you', 'later', 'cya', 'farewell', 'done', 'close', 'exit', 'nothing'],
        response: "Thanks for chatting! 👋 Come back any time you have questions.\n\nTogether, we're making a real difference. 💚",
        quickReplies: [],
    },
];

const FALLBACK_RESPONSES = [
    "I'm not sure I understand that, but I'm happy to help! Try asking about:\n\n• How to donate food\n• How to volunteer\n• Finding food assistance\n• Joining the platform\n• Contacting our team",
    "Hmm, I didn't quite catch that. Could you rephrase? I can help with questions about donating food, volunteering, finding assistance, or how Skint Help works.",
    "I'm still learning! For that question, it might be best to contact our team directly. Or try asking me about restaurants, volunteers, or food assistance.",
];

// ─── Response Engine ──────────────────────────────────────────────────────────

function getResponse(input) {
    const lower = input.toLowerCase().trim();

    // Score each KB entry based on keyword matches
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of KB) {
        for (const pattern of entry.patterns) {
            if (lower.includes(pattern)) {
                const score = pattern.length; // longer pattern = more specific match
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = entry;
                }
            }
        }
    }

    if (bestMatch) return bestMatch;

    // Return a random fallback
    return {
        id: 'fallback',
        response: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
        quickReplies: ['How does it work?', 'Contact the team', 'Join the platform'],
    };
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, onQuickReply, onNavigate }) {
    const isBot = msg.from === 'bot';

    const formatText = (text) => {
        return text.split('\n').map((line, i) => {
            // Bold text
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <span key={i}>
                    {parts.map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                    {i < text.split('\n').length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            {isBot && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mb-1">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            )}

            <div className={`max-w-[80%] space-y-2`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isBot
                        ? 'bg-white/10 border border-white/10 text-white rounded-bl-sm'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-sm'
                }`}>
                    {formatText(msg.text)}
                </div>

                {/* Quick replies */}
                {isBot && msg.quickReplies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.quickReplies.map((reply) => (
                            <button
                                key={reply}
                                onClick={() => onQuickReply(reply)}
                                className="text-xs px-3 py-1.5 rounded-full border border-green-500/40 text-green-400 hover:bg-green-500/15 transition-colors duration-150"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                {/* Navigation link */}
                {isBot && msg.link && (
                    <button
                        onClick={() => onNavigate(msg.link.path)}
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-1"
                    >
                        <span>→ {msg.link.label}</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-end gap-2"
        >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/10 border border-white/10 flex gap-1 items-center">
                {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

// ─── Main ChatBot Component ───────────────────────────────────────────────────

const WELCOME_MSG = {
    id: Date.now(),
    from: 'bot',
    text: "Hi! I'm Skint 👋 Your Skint Help assistant.\n\nHow can I help you today?",
    quickReplies: ['How does it work?', 'I want to donate food', 'I want to volunteer', 'I need food help'],
};

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MSG]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Hide chatbot inside portal dashboards (sidebar layouts)
    const hiddenPaths = ['/sysadmin/', '/restaurant/', '/worker/', '/customer/'];
    const isHidden = hiddenPaths.some(p => location.pathname.startsWith(p));

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setHasUnread(false);
        }
    }, [isOpen]);

    // Show unread badge after 4s if user hasn't opened it yet
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setHasUnread(true), 4000);
            return () => clearTimeout(timer);
        }
    }, []);

    const addBotMessage = (entry) => {
        setIsTyping(true);
        const delay = Math.min(600 + entry.response.length * 8, 2000);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                from: 'bot',
                text: entry.response,
                quickReplies: entry.quickReplies || [],
                link: entry.link || null,
            }]);
            if (!isOpen) setHasUnread(true);
        }, delay);
    };

    const handleSend = (text) => {
        const value = (text || input).trim();
        if (!value) return;

        // Map quick reply labels to internal queries
        const quickReplyMap = {
            'Open Food Map': 'food map',
            'Open Join Us page': 'join',
            'Open contact page': 'contact',
            'Go to login': 'login',
            'Apply now': 'apply',
            'Apply as Restaurant': 'apply',
            'Apply to volunteer': 'apply',
            'Apply as a center': 'join as center',
            'See full impact page': 'impact',
            'Join the mission': 'apply',
            'How to login to restaurant portal': 'login',
            'How to login to volunteer portal': 'login',
            'What happens after I apply?': 'after apply',
            'Become a collection center': 'collection center partner',
            'I need to apply first': 'apply',
            'Sign in for assistance': 'login',
            'Find a collection center': 'collection center',
            'Contact the team': 'contact',
            'Contact for details': 'contact',
            'Join the platform': 'join',
            'Join as a restaurant': 'donate food',
            'Join as the mission': 'apply',
            'Become a volunteer': 'volunteer',
            'Find food near me': 'need food',
            'I want to donate food': 'donate food',
            'I want to volunteer': 'volunteer',
            'I need food help': 'need food',
            'How does it work?': 'how does it work',
            'See our impact': 'impact',
            'Full How It Works': 'how does it work',
            'What food can I donate?': 'what food',
            'What is the commitment?': 'volunteer commitment',
            'Donate food as a restaurant': 'donate food',
            'Learn more about collection centers': 'collection centers',
            'Join the mission': 'apply',
            'How to donate food': 'donate food',
            'How to volunteer': 'volunteer',
            'Join as a restaurant': 'donate food',
            'Open Food Map': 'food map',
            'See full impact page': 'impact',
            'Restaurant Login': 'login',
            'Worker Login': 'login',
            'Become a collection center': 'collection center partner',
        };

        const query = quickReplyMap[value] || value;

        setMessages(prev => [...prev, {
            id: Date.now(),
            from: 'user',
            text: value,
            quickReplies: [],
            link: null,
        }]);
        setInput('');

        const entry = getResponse(query);
        addBotMessage(entry);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleReset = () => {
        setMessages([WELCOME_MSG]);
        setInput('');
    };

    if (isHidden) return null;

    return (
        <>
            {/* ── Chat Window ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-[400px]"
                        style={{ height: 'min(520px, calc(100vh - 120px))' }}
                    >
                        <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            style={{ background: 'rgba(10,12,20,0.92)', backdropFilter: 'blur(20px)' }}>

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
                                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.10))' }}>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">Skint Assistant</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            <span className="text-xs text-white/50">Online · Always here to help</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handleReset}
                                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                        title="Reset chat"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                        title="Close"
                                    >
                                        <Minimize2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                {messages.map((msg) => (
                                    <MessageBubble
                                        key={msg.id}
                                        msg={msg}
                                        onQuickReply={handleSend}
                                        onNavigate={handleNavigate}
                                    />
                                ))}
                                <AnimatePresence>
                                    {isTyping && <TypingIndicator />}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="px-4 py-3 border-t border-white/10">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything..."
                                        disabled={isTyping}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/40 focus:bg-white/8 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isTyping}
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-30 flex-shrink-0"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                                <p className="text-center text-xs text-white/20 mt-2">Skint Help · Powered by smart FAQ</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Floating Button ── */}
            <motion.button
                onClick={() => setIsOpen(prev => !prev)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/30 border border-white/10"
                aria-label="Open chat assistant"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <Bot className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Unread badge */}
                <AnimatePresence>
                    {hasUnread && !isOpen && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0a0a0f] flex items-center justify-center"
                        >
                            <span className="text-white text-[9px] font-bold">1</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    );
}
