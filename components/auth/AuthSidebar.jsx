import { ShoppingBag, Users, TrendingUp, Zap } from 'lucide-react';

export default function AuthSidebar() {
  const features = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Social Commerce",
      description: "Buy and sell directly through social interactions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect & Engage",
      description: "Build meaningful relationships with your community"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Grow Your Business",
      description: "Turn your passion into a thriving enterprise"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Payments",
      description: "Secure transactions with multiple payment options"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white p-10 hidden lg:flex flex-col justify-center items-center relative overflow-hidden w-1/2">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-white animate-bounce"></div>
        <div className="absolute top-1/2 right-32 w-16 h-16 rounded-full bg-white animate-ping"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
          Sosay
        </h1>
        <p className="text-xl opacity-90 mb-12 leading-relaxed">
          Where connections and commerce thrive. Social ecommerce platform.
        </p>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-6 opacity-90 hover:opacity-100 transition-all duration-300 group"
            >
              <div className="p-4 bg-white/15 rounded-xl group-hover:bg-white/25 transition-all duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-white/20 to-transparent"></div>
    </div>
  );
}