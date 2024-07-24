import { useUserContext } from "../hooks/useUserContext";

export default function Homepage() {
  const { user } = useUserContext();

  return (
    <div>
        {user}
    </div>
  );
}
