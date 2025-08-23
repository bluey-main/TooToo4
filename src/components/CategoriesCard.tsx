
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface CategoriesCardProps {
  icon: ReactNode;
  category: string;
}

const CategoriesCard: React.FC<CategoriesCardProps> = ({ icon, category }) => {
  return (
    <Link to={`/categories/${category.toLowerCase()}`} className=" flex flex-col items-center gap-2">
        <div className=" rounded-full bg-white p-5">
            {icon}
        </div>
        <p className=" font-semibold">{category}</p>
    </Link>
  )
}

export default CategoriesCard
