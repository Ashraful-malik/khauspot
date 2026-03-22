"use client";
import ProjectCard from "./project-card";

function ProjectList() {
  const projects = [
    { id: 1, name: "Rahul Momos", location: "College Road" },
    { id: 2, name: "Sharma Chaat", location: "Main Market" },
    { id: 3, name: "Raju Samosha", location: "Main Market" },
    { id: 4, name: "Ramesh Biryani", location: "Main Market" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Pending Stall Suggestions</h1>

      <div
        className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
      "
      >
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
export default ProjectList;
