type Props = {
  number: string;
  title: string;
  description: string;
};

const StepCard = ({ title, number, description }: Props) => {
  return (
    <div className="flex gap-6 items-start bg-[#0D1B2A]/50 rounded-2xl p-8 border border-[#0AA2DD]/20">
      <div className="shrink-0 w-14 h-14 bg-[#FFC107] rounded-full flex items-center justify-center">
        <span className="text-[#0D1B2A] font-bold text-xl">{number}</span>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/80 leading-relaxed text-lg">{description}</p>
      </div>
    </div>
  );
};

export default StepCard;
