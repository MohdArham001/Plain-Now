
import { useNavigate } from 'react-router-dom';
import { Upload, Cpu, CheckCircle, ArrowRight, FileText } from 'lucide-react';

export default function HowItWorks() {
    const navigate = useNavigate();

    const steps = [
        {
            title: "1. Upload Your Document",
            description: "Simply take a photo or upload a PDF of the confusing letter, bill, or contract.",
            icon: <Upload className="w-8 h-8 text-indigo-500" />,
            color: "bg-indigo-50",
            image: "/step1.png"
        },
        {
            title: "2. AI Analyzes Every Word",
            description: "Our advanced AI reads the text, identifying key dates, amounts, and action items.",
            icon: <Cpu className="w-8 h-8 text-purple-500" />,
            color: "bg-purple-50",
            image: "/step2.png"
        },
        {
            title: "3. Get Crystal Clear Answers",
            description: "Receive a simple summary of what the document means and exactly what you need to do.",
            icon: <CheckCircle className="w-8 h-8 text-green-500" />,
            color: "bg-green-50",
            image: "/step3.png"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-auto md:h-20 flex flex-col md:flex-row items-center justify-between py-4 md:py-0 gap-4">
                    <div className="w-full md:w-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <span className="text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1 text-sm md:text-base">
                                &larr; Back
                            </span>
                        </div>

                        <div className="flex items-center gap-2 cursor-pointer md:absolute md:left-1/2 md:-translate-x-1/2" onClick={() => navigate('/')}>
                            <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg">
                                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900">PlainNow</span>
                        </div>

                        {/* Spacer for mobile alignment */}
                        <div className="w-[45px] md:hidden"></div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate('/auth')}
                            className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        How <span className="text-indigo-600">PlainNow</span> Works
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Turning complex jargon into simple English is easier than you think.
                    </p>
                </div>

                <div className="space-y-16 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Visual/Image Placeholder */}
                            <div className="flex-1 w-full">
                                <div className={`aspect-video rounded-2xl ${step.color} border border-gray-100 flex items-center justify-center relative overflow-hidden group hover:shadow-lg transition-shadow`}>
                                    {/* Placeholder for Screenshot */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    {/* Overlay for icon */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-white/80 p-4 rounded-full shadow-lg backdrop-blur-sm">
                                            {step.icon}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className={`inline-flex p-3 rounded-xl ${step.color} mb-4`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 text-lg leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <button
                        onClick={() => navigate('/auth')}
                        className="bg-indigo-600 text-white h-14 px-10 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 inline-flex items-center gap-2"
                    >
                        <span>Try it Yourself</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </main>
        </div>
    );
}
