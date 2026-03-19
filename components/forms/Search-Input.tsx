"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SearchIcon } from "lucide-react";

export default function SearchInput() {
  return (
    <InputGroup className="h-9">
      <InputGroupInput
        id="inline-start-input"
        placeholder="Search street food..."
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
