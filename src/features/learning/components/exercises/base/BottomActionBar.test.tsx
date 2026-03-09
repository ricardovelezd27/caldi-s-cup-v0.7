import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { BottomActionBar } from "./BottomActionBar";

describe("BottomActionBar", () => {
  it("renders Check text in disabled state", () => {
    render(<BottomActionBar state="disabled" onClick={vi.fn()} />);
    expect(screen.getByText("Check")).toBeInTheDocument();
  });

  it("button is disabled when state is disabled", () => {
    render(<BottomActionBar state="disabled" onClick={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("button is clickable when state is ready", () => {
    const onClick = vi.fn();
    render(<BottomActionBar state="ready" onClick={onClick} />);
    const btn = screen.getByRole("button");
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders Continue text in correct state", () => {
    render(<BottomActionBar state="correct" onClick={vi.fn()} />);
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("renders Got it text in incorrect state", () => {
    render(<BottomActionBar state="incorrect" onClick={vi.fn()} />);
    expect(screen.getByText(/got it/i)).toBeInTheDocument();
  });
});
