type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: Props) => {
  return (
    <div className="bg-[#1B2838] rounded-2xl p-8 hover:bg-[#253446] transition-all hover:transform hover:scale-105 border border-[#0AA2DD]/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
