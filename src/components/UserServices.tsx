import { service } from "../../types/service-type";
import { LuExternalLink } from "react-icons/lu";

interface UserServicesProps {
  services: service[];
  name?: string;
  badgeName?: string;
}

const UserServices: React.FC<UserServicesProps> = ({
  services,
  name,
  badgeName,
}) => {
  return (
    <div className="flex flex-col md:items-center md:gap-1">
      {name && badgeName ? (
        <div>
          {name}, {badgeName}
        </div>
      ) : (
        "Available at"
      )}
      <div className="flex flex-row md:flex-col flex-wrap items-center gap-1">
        {services.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-row items-center gap-1">
              <LuExternalLink size={18} />
              {item.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default UserServices;
