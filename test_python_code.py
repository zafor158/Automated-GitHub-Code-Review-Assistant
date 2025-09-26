#!/usr/bin/env python3
"""
Simple Python script for testing AI code review functionality.
This file contains various code patterns that should trigger different types of reviews.
"""

import os
import sys
from typing import List, Dict, Optional

# Global variable (potential issue)
API_KEY = "hardcoded_secret_key_12345"  # Security issue - hardcoded secret

def calculate_fibonacci(n: int) -> int:
    """
    Calculate the nth Fibonacci number.
    
    Args:
        n: The position in the Fibonacci sequence
        
    Returns:
        The nth Fibonacci number
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        # Inefficient recursive approach (performance issue)
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def process_user_data(user_data: Dict[str, str]) -> Optional[str]:
    """
    Process user data and return formatted result.
    
    Args:
        user_data: Dictionary containing user information
        
    Returns:
        Formatted user data string or None if invalid
    """
    # Missing input validation (potential bug)
    name = user_data['name']
    email = user_data['email']
    
    # TODO: Add email validation (maintainability issue)
    # FIXME: Handle missing keys properly (bug)
    
    # Console log in production code (style issue)
    print(f"Processing user: {name}")
    
    return f"User: {name} <{email}>"

def divide_numbers(a: float, b: float) -> float:
    """
    Divide two numbers.
    
    Args:
        a: Dividend
        b: Divisor
        
    Returns:
        Result of division
    """
    # Potential division by zero bug
    result = a / b
    return result

def main():
    """Main function to demonstrate various code patterns."""
    # Test data
    test_user = {
        'name': 'John Doe',
        'email': 'john@example.com'
    }
    
    # Test function calls
    fib_result = calculate_fibonacci(10)
    user_result = process_user_data(test_user)
    div_result = divide_numbers(10, 2)
    
    # Print results
    print(f"Fibonacci(10) = {fib_result}")
    print(f"User data: {user_result}")
    print(f"Division result: {div_result}")
    
    # Test with potential error
    try:
        error_result = divide_numbers(10, 0)
        print(f"Error test result: {error_result}")
    except ZeroDivisionError:
        print("Caught division by zero error")

if __name__ == "__main__":
    main()
