#!/usr/bin/env python3
"""
A simple Hello World application
"""

def greet(name="World"):
    """
    Greet someone by name

    Args:
        name (str): The name to greet. Defaults to "World"

    Returns:
        str: The greeting message
    """
    return f"Hello, {name}!"

def main():
    """
    Main entry point for the Hello World app
    """
    print("=" * 40)
    print(greet())
    print(greet("Python"))
    print(greet("User"))
    print("=" * 40)
    print("\nWelcome to the Hello World App!")

if __name__ == "__main__":
    main()
