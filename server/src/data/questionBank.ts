import { BankQuestion } from '../types/index.js';

export const QUESTION_BANK: BankQuestion[] = [
  // ================= EXCEPTION HANDLING (College Activity Required) =================
  {
    id: 'eh-001',
    topicId: 'exception-handling',
    topicName: 'Exception Handling',
    difficulty: 'Beginner',
    question: 'Explain the purpose of the try, throw, and catch keywords in C++. How do they work together to handle runtime errors?',
    expectedAnswer: 'The try block encloses code that may throw an exception. The throw keyword is used to signal/raise the exception with a value or object. The catch block intercepts and handles the thrown exception of matching type.',
    keyPoints: [
      'try block surrounds code where exceptions may occur',
      'throw keyword explicitly raises an exception object or value',
      'catch block follows try to intercept and process matching exception types',
      'Prevents abrupt program crash by transferring control to handler'
    ],
    hint: 'Think about the 3-step sequence: guarding risky code, signalling an error condition, and intercepting it with a handler block.',
    explanation: 'In C++, structured exception handling separates error detection (throw) from error resolution (catch), within guarded blocks (try). When a throw occurs, normal execution halts and the runtime looks up matching catch handlers.',
    maxMarks: 10,
    followUpPrompt: 'What happens if an exception is thrown inside a try block but none of the catch blocks match its type?'
  },
  {
    id: 'eh-002',
    topicId: 'exception-handling',
    topicName: 'Exception Handling',
    difficulty: 'Intermediate',
    question: 'How do multiple catch blocks work in C++? In what order should derived and base exception classes be caught, and why is this ordering critical?',
    codeSnippet: `try {
    // risky operation
} catch (const std::exception& e) {
    // handler A
} catch (const std::runtime_error& e) {
    // handler B
}`,
    expectedAnswer: 'When multiple catch blocks are present, they are checked in top-to-bottom sequential order. Derived exception classes MUST be caught before base exception classes. If base is caught first, it will intercept all derived exceptions due to polymorphism/upcasting, causing the derived catch block to be unreachable dead code.',
    keyPoints: [
      'Sequential top-to-bottom catch evaluation',
      'Derived exception handlers must precede base class handlers',
      'Base handler placed first shadows derived handlers via implicit upcasting',
      'Compiler warning or dead code results if order is reversed'
    ],
    hint: 'Consider how object-oriented inheritance affects catch parameter matching when catching by reference.',
    explanation: 'A catch block catching `const std::exception&` will match any object whose class inherits from `std::exception` (such as `std::runtime_error`). Therefore, specific derived handlers must be placed higher up.',
    maxMarks: 10,
    followUpPrompt: 'Why is it strongly recommended to catch exceptions by const reference rather than by value?'
  },
  {
    id: 'eh-003',
    topicId: 'exception-handling',
    topicName: 'Exception Handling',
    difficulty: 'Intermediate',
    question: 'What is the catch-all block `catch(...)`? When should it be used, and where must it be positioned in a series of catch blocks?',
    expectedAnswer: '`catch(...)` is a catch-all handler that catches any exception regardless of its type. It must always be placed as the very last catch block in a sequence, because putting it earlier would catch everything and make all subsequent catch blocks unreachable.',
    keyPoints: [
      'Catches any exception of any type (ellipsis syntax)',
      'Must be placed at the very end of the catch block chain',
      'Does not provide access to the thrown exception object directly',
      'Often used for cleanup before re-throwing or logging a generic fatal error'
    ],
    hint: 'Look at the syntax with three dots (...). It acts as a universal fallback.',
    explanation: 'The catch-all `catch(...)` acts as a safety net for unexpected exception types. Since it matches everything, any catch block placed after it is unreachable.',
    maxMarks: 10,
    followUpPrompt: 'How can you re-throw the same exception from inside a catch(...) block to propagate it to an outer handler?'
  },
  {
    id: 'eh-004',
    topicId: 'exception-handling',
    topicName: 'Exception Handling',
    difficulty: 'Advanced',
    question: 'Explain the concept of nested try blocks and exception re-throwing using `throw;`. What is Stack Unwinding and how does it guarantee resource safety?',
    codeSnippet: `try {
    try {
        throw std::runtime_error("Disk full");
    } catch (...) {
        std::cout << "Inner log\\n";
        throw; // re-throw
    }
} catch (const std::exception& e) {
    std::cout << "Outer catch: " << e.what() << "\\n";
}`,
    expectedAnswer: 'A try block can be nested inside another try block. The `throw;` statement with no operand re-throws the currently active exception to the enclosing outer try-catch block. Stack unwinding is the automatic destruction of all local objects on the call stack between the throw point and the catch handler, invoking their destructors to free resources (RAII).',
    keyPoints: [
      'Nested try allows hierarchical, localized error handling',
      '`throw;` without arguments preserves and propagates original exception object',
      'Stack unwinding automatically invokes destructors for local stack-allocated objects',
      'Guarantees no resource leaks if RAII pattern is followed'
    ],
    hint: 'Focus on what `throw;` (with nothing after it) does, and what happens to local variables when the runtime exits stack frames.',
    explanation: 'When an exception propagates up, stack unwinding cleans up each stack frame by calling destructors of local objects. If a destructor itself throws during stack unwinding, `std::terminate` is immediately called.',
    maxMarks: 10,
    followUpPrompt: 'What happens if an exception escapes from a destructor during stack unwinding?'
  },
  {
    id: 'eh-005',
    topicId: 'exception-handling',
    topicName: 'Exception Handling',
    difficulty: 'Advanced',
    question: 'How do you create a custom user-defined exception class in C++? Which standard class should it inherit from, and what member function should you override?',
    codeSnippet: `class InsufficientFundsException : public std::exception {
    std::string message;
public:
    InsufficientFundsException(const std::string& msg) : message(msg) {}
    const char* what() const noexcept override {
        return message.c_str();
    }
};`,
    expectedAnswer: 'A custom exception class typically inherits publicly from `std::exception` (or `std::runtime_error`). You override the virtual `const char* what() const noexcept` function to return an explanatory error string.',
    keyPoints: [
      'Inherit publicly from std::exception or std::runtime_error',
      'Override the what() const noexcept member function',
      'what() returns a const char* explaining the error',
      'noexcept specifier ensures the what() method itself never throws'
    ],
    hint: 'Think about standard polymorphism: what method does `e.what()` call on a caught exception?',
    explanation: 'Inheriting from `std::exception` ensures your custom exception integrates seamlessly into standard C++ error-handling frameworks, allowing polymorphic catch via `catch(const std::exception& e)`.',
    maxMarks: 10,
    followUpPrompt: 'Why is `noexcept` required on the `what()` method in modern C++?'
  },

  // ================= TEMPLATES & GENERIC PROGRAMMING (College Activity Required) =================
  {
    id: 'tpl-001',
    topicId: 'templates',
    topicName: 'Templates',
    difficulty: 'Beginner',
    question: 'What is a function template in C++, and what problem does it solve compared to writing multiple overloaded functions?',
    codeSnippet: `template <typename T>
T findMax(T a, T b) {
    return (a > b) ? a : b;
}`,
    expectedAnswer: 'A function template is a blueprint that allows writing generic functions capable of working with multiple data types without duplicating code. Instead of writing separate overloaded functions for int, double, float, etc., the compiler generates the specific type version at compile-time based on argument types.',
    keyPoints: [
      'Generic code blueprint for functions',
      'Avoids code duplication across multiple data types',
      'The compiler instantiates concrete functions at compile-time',
      'Type deduction automatically determines T from function arguments'
    ],
    hint: 'Think about code duplication: if you need a max function for int, double, and string, how do templates help?',
    explanation: 'Templates embody generic programming in C++. The keyword `template <typename T>` declares a type parameter T, allowing the compiler to stamp out concrete functions on demand with zero runtime overhead.',
    maxMarks: 10,
    followUpPrompt: 'What happens at compile time if you call `findMax(5, 4.2)` without specifying the template argument?'
  },
  {
    id: 'tpl-002',
    topicId: 'templates',
    topicName: 'Templates',
    difficulty: 'Intermediate',
    question: 'Explain what a Class Template is in C++. How do you declare and instantiate a generic Stack or Pair class?',
    codeSnippet: `template <typename T>
class Pair {
    T first, second;
public:
    Pair(T a, T b) : first(a), second(b) {}
    T getFirst() const { return first; }
};`,
    expectedAnswer: 'A class template allows creating a generic class where member variable types and method return/parameter types are parameterized by one or more type placeholders. Instantiation requires providing type arguments, such as `Pair<int> p(10, 20);` or `std::vector<std::string>`.',
    keyPoints: [
      'Parameterized class blueprint for generic data structures',
      'Instantiated using angle brackets syntax: ClassName<Type>',
      'Member functions defined outside class must also include template prefix',
      'Enables standard containers like std::vector<T> and std::stack<T>'
    ],
    hint: 'Think of STL containers like `std::vector<int>` or `std::vector<double>`—how are they defined?',
    explanation: 'Class templates are foundational for STL containers. When the compiler encounters `Pair<int>`, it generates a distinct class with `int` substituted for `T`.',
    maxMarks: 10,
    followUpPrompt: 'Can a class template have multiple type parameters, such as `template <typename T1, typename T2>`?'
  },
  {
    id: 'tpl-003',
    topicId: 'templates',
    topicName: 'Templates',
    difficulty: 'Intermediate',
    question: 'What are Non-Type Template Parameters in C++? Give an example of how they are used (e.g., in a fixed-size array).',
    codeSnippet: `template <typename T, int Size>
class FixedArray {
    T data[Size];
public:
    int getSize() const { return Size; }
};`,
    expectedAnswer: 'Non-type template parameters are parameters in a template that represent constant values known at compile time rather than types. Common examples include integer constants, size values, and pointers/references. In `FixedArray<int, 10>`, 10 is a non-type parameter that sets array bounds at compile time with stack allocation.',
    keyPoints: [
      'Template parameters that are values (constants) rather than types',
      'Value must be known at compile time (constexpr/integral constant)',
      'Used for static buffer sizes (like std::array<T, N>)',
      'Creates distinct compiled types for different values (e.g., Array<int, 5> vs Array<int, 10>)'
    ],
    hint: 'Look at `template <typename T, int Size>`—what is `int Size` representing here?',
    explanation: 'Non-type template parameters enable compile-time optimizations and fixed-size structures without heap allocations. `std::array<int, 5>` is the standard library implementation of this concept.',
    maxMarks: 10,
    followUpPrompt: 'Can a floating-point number (like 3.14) or a runtime user input variable be used as a non-type template parameter in C++11?'
  },
  {
    id: 'tpl-004',
    topicId: 'templates',
    topicName: 'Templates',
    difficulty: 'Advanced',
    question: 'What is Template Specialization (both Full and Partial)? Why and when would you specialize a template for a specific type like `char*` or `bool`?',
    codeSnippet: `// Primary template
template <typename T>
class Storage { public: void print() { std::cout << "Generic\\n"; } };

// Full specialization for bool
template <>
class Storage<bool> { public: void print() { std::cout << "Specialized for bool\\n"; } };`,
    expectedAnswer: 'Template specialization provides a custom implementation of a template for a specific type. Full specialization specifies all template parameters (e.g., `Storage<bool>`), while partial specialization specifies a subset or adds qualifiers (e.g., pointers `T*`). It is used when a specific type requires custom handling, such as using `strcmp` for `char*` or bit-packing 8 booleans into a single byte in `std::vector<bool>`.',
    keyPoints: [
      'Custom implementation overriding the primary template for specific types',
      'Full specialization uses `template <>` syntax',
      'Partial specialization modifies a subset or type patterns (e.g., pointers T*)',
      'Function templates support full specialization; class templates support both full and partial',
      'Used for optimization (std::vector<bool>) or specialized behavior (strings/pointers)'
    ],
    hint: 'Think about `std::vector<bool>`—why does it behave differently from `std::vector<int>`?',
    explanation: 'Template specialization enables fine-grained performance tuning and algorithmic tailoring. If generic pointer comparison compares addresses, specialization for `const char*` can use `std::strcmp`.',
    maxMarks: 10,
    followUpPrompt: 'Why do function templates not support partial specialization in C++, and how can function overloading achieve a similar result?'
  },
  {
    id: 'tpl-005',
    topicId: 'templates',
    topicName: 'Templates',
    difficulty: 'Advanced',
    question: 'Why are template definitions almost always placed in header files (.h / .hpp) rather than separate implementation files (.cpp)? What compiler error occurs if you put them in .cpp?',
    expectedAnswer: 'Templates are blueprints, not concrete compiled code. The compiler needs to see the full definition at the point of instantiation in translation units where the template is used. If the definition is in a .cpp file, other compilation units only see the declaration and the compiler cannot generate the specialized code, leading to an "Undefined Reference" Linker Error.',
    keyPoints: [
      'Templates are compile-time code generators requiring full definitions at call sites',
      'Placing definitions in separate .cpp files causes "undefined reference" linker errors',
      'The compiler cannot instantiate code for types it cannot inspect during compilation',
      'Header-only inclusion or explicit instantiation files are required solutions'
    ],
    hint: 'Think about how the C++ compilation model works: separate translation units and the linker.',
    explanation: 'In C++, each .cpp is compiled independently into an object file. Without seeing the template body, a translation unit cannot instantiate `MyClass<int>`, and the other translation unit never knew to instantiate it for `int`.',
    maxMarks: 10,
    followUpPrompt: 'What is explicit template instantiation and how can it be used to split a template into a .cpp file?'
  },

  // ================= OBJECT-ORIENTED PROGRAMMING =================
  {
    id: 'oop-001',
    topicId: 'classes-objects',
    topicName: 'Classes and Objects',
    difficulty: 'Beginner',
    question: 'What is the fundamental difference between a `struct` and a `class` in C++?',
    expectedAnswer: 'The only fundamental difference between a struct and a class in C++ is their default member access specifier and default inheritance access specifier. In a `struct`, members and base classes are `public` by default, whereas in a `class`, members and base classes are `private` by default.',
    keyPoints: [
      'In a struct, default access specifier is public',
      'In a class, default access specifier is private',
      'Default inheritance for struct is public; for class it is private',
      'Both support member functions, constructors, inheritance, and polymorphism'
    ],
    hint: 'Think about what happens if you declare variables inside each without specifying `public:` or `private:`.',
    explanation: 'Unlike C where structs only hold data, C++ structs are full classes with the sole difference being default visibility: struct defaults to public, class defaults to private.',
    maxMarks: 10,
    followUpPrompt: 'When would you conventionally choose to use a struct over a class in production code?'
  },
  {
    id: 'oop-002',
    topicId: 'constructors',
    topicName: 'Constructors',
    difficulty: 'Intermediate',
    question: 'Explain Shallow Copy vs Deep Copy in C++. Why does a class containing raw dynamically allocated pointers require a custom Copy Constructor and Copy Assignment Operator?',
    expectedAnswer: 'A shallow copy copies all member values bitwise, meaning pointers in both objects point to the exact same heap memory address. A deep copy allocates new heap memory and copies the actual underlying data. If a class has pointers and relies on default shallow copying, destroying both objects causes a double-free runtime crash and memory corruption.',
    keyPoints: [
      'Shallow copy copies pointer addresses, causing both objects to share identical heap memory',
      'Deep copy allocates distinct memory and copies the actual values',
      'Default copy constructor performs shallow member-wise copying',
      'Double deletion (double free) and dangling pointers occur on destruction without deep copy',
      'Related to the Rule of Three / Rule of Five'
    ],
    hint: 'Think about what happens when object A and object B both point to the same `int*` heap pointer and their destructors run.',
    explanation: 'The compiler-generated copy constructor performs shallow copying. If your class manages dynamic heap memory (`new`), you must provide a custom copy constructor and assignment operator to allocate new memory for the copy.',
    maxMarks: 10,
    followUpPrompt: 'What is the Rule of Three, and how did C++11 expand it to the Rule of Five?'
  },
  {
    id: 'oop-003',
    topicId: 'virtual-functions',
    topicName: 'Virtual Functions',
    difficulty: 'Intermediate',
    question: 'What is a virtual function in C++? Explain the internal working of VTABLE (Virtual Table) and VPTR (Virtual Pointer).',
    codeSnippet: `class Base {
public:
    virtual void show() { std::cout << "Base\\n"; }
};
class Derived : public Base {
public:
    void show() override { std::cout << "Derived\\n"; }
};`,
    expectedAnswer: 'A virtual function enables runtime (dynamic) polymorphism. When a class has virtual functions, the compiler creates a static VTABLE containing function pointers for that class, and inserts a hidden pointer (VPTR) into every object of that class. At runtime, calls via base pointers dereference VPTR to look up the correct derived function address in VTABLE.',
    keyPoints: [
      'Enables dynamic / late binding and runtime polymorphism',
      'VTABLE is a static table of virtual function pointers created per class',
      'VPTR is a hidden pointer stored inside each object pointing to its class VTABLE',
      'Base pointer resolves method at runtime by indexing into VTABLE',
      'Adds slight memory overhead (pointer size per object) and indirection call cost'
    ],
    hint: 'How does the program know which function to call when a `Base*` points to a `Derived` instance at runtime?',
    explanation: 'VTABLE/VPTR is the standard compiler mechanism for dynamic dispatch. Calling `ptr->show()` translates to `*(ptr->vptr[index])()`, which resolves to `Derived::show` at runtime.',
    maxMarks: 10,
    followUpPrompt: 'Why should a base class intended for polymorphic deletion always have a `virtual` destructor?'
  },
  {
    id: 'oop-004',
    topicId: 'multiple-inheritance-ambiguity',
    topicName: 'Multiple Inheritance',
    difficulty: 'Advanced',
    question: 'Explain the Diamond Problem in C++ multiple inheritance. How does `virtual` base inheritance solve this problem?',
    codeSnippet: `// Diamond structure:
//     A
//    / \\
//   B   C
//    \\ /
//     D
class A { public: int val; };
class B : virtual public A {};
class C : virtual public A {};
class D : public B, public C {};`,
    expectedAnswer: 'The Diamond Problem occurs when a derived class D inherits from two intermediate classes B and C, which both inherit from a common base class A. Without virtual inheritance, class D would inherit two separate copies of class A subobjects, leading to memory duplication and compiler ambiguity when accessing members of A. Using `virtual public A` in B and C ensures only one shared instance of A exists in D.',
    keyPoints: [
      'Occurs when two base classes share a common ancestor and a derived class inherits both',
      'Causes duplicate base class subobjects and member access ambiguity errors',
      '`virtual` base class ensures only a single shared instance of the ancestor class exists',
      'The most derived class (D) is directly responsible for calling the virtual base (A) constructor'
    ],
    hint: 'Look at the diamond shape: D inherits from B and C, both inheriting A. How many copies of A would D have normally?',
    explanation: 'Virtual inheritance introduces a virtual base pointer table, ensuring that no matter how many inheritance paths lead back to class A, only one shared subobject of A is constructed.',
    maxMarks: 10,
    followUpPrompt: 'In virtual inheritance, which class constructor is responsible for invoking the virtual base class constructor?'
  },
  {
    id: 'oop-005',
    topicId: 'operator-overloading',
    topicName: 'Operator Overloading',
    difficulty: 'Intermediate',
    question: 'Why must the stream insertion (`<<`) and stream extraction (`>>`) operators be overloaded as friend functions (or free non-member functions) rather than member functions of your class?',
    codeSnippet: `class Complex {
    double real, imag;
public:
    friend std::ostream& operator<<(std::ostream& os, const Complex& c);
};`,
    expectedAnswer: 'When overloading a binary operator as a member function, the left-hand operand must be an object of that class (becoming the `this` pointer). For `std::cout << obj`, the left operand is `std::ostream`, which is a standard library class we cannot modify. Therefore, `operator<<` must be a non-member/friend function taking `std::ostream&` as its first parameter.',
    keyPoints: [
      'Left operand of `std::cout << obj` is std::ostream, not our class',
      'Member operator overloading requires the left operand to be an instance of the declaring class',
      'We cannot alter standard library classes like std::ostream to add member operators',
      'Non-member friend function allows stream as 1st argument and custom object as 2nd argument',
      'Returns `std::ostream&` to enable chained output operations (e.g. cout << a << b)'
    ],
    hint: 'Consider the expression `std::cout << myObject`. What object is on the left side of `<<`?',
    explanation: 'Because operator syntax maps `a << b` to `a.operator<<(b)` for member operators, overloading `<<` as a member of `Complex` would force the awkward syntax `myComplex << std::cout`.',
    maxMarks: 10,
    followUpPrompt: 'Why does `operator<<` return `std::ostream&` by reference?'
  },

  // ================= POINTERS, REFERENCES & MEMORY =================
  {
    id: 'mem-001',
    topicId: 'pointers',
    topicName: 'Pointers & References',
    difficulty: 'Beginner',
    question: 'What are the main differences between a pointer and a reference in C++?',
    expectedAnswer: 'A pointer is a variable that stores a memory address and can be reassigned, can be null (`nullptr`), and requires dereferencing (`*`). A reference is an alias to an existing object, cannot be null, must be initialized upon declaration, and cannot be reseated to refer to another object.',
    keyPoints: [
      'Pointer holds an address; reference is an alias for an existing object',
      'Pointers can be nullptr or uninitialized; references must bind to a valid object',
      'Pointers can be reassigned to point elsewhere; references cannot be rebound',
      'Pointers use * and -> operators; references use direct dot syntax like the original object'
    ],
    hint: 'Think about initialization, nullability, re-assignment to another variable, and syntax.',
    explanation: 'Under the hood, references are often implemented as const pointers with automatic dereferencing by the compiler, but semantically they provide safe, non-reseatable aliasing.',
    maxMarks: 10,
    followUpPrompt: 'Can you create an array of references in C++? Why or why not?'
  },
  {
    id: 'mem-002',
    topicId: 'dynamic-memory-allocation',
    topicName: 'Dynamic Memory Allocation',
    difficulty: 'Intermediate',
    question: 'Compare `new` and `delete` in C++ with `malloc` and `free` in C. Why should you never mix them?',
    expectedAnswer: '`new` and `delete` are C++ operators that automatically calculate size, return type-safe pointers, and invoke constructors and destructors. `malloc` and `free` are C library functions that operate on raw byte sizes, return `void*`, and do NOT call constructors or destructors. Mixing them causes undefined behavior and resource leaks.',
    keyPoints: [
      'new calls constructors; malloc only allocates raw uninitialized memory',
      'delete calls destructors; free only releases memory without calling destructors',
      'new is type-safe without casting; malloc returns void*',
      'new throws std::bad_alloc on failure; malloc returns NULL',
      'Mixing them leads to undefined behavior and resource leaks'
    ],
    hint: 'What does `new` do for an object of a class that `malloc` has no awareness of?',
    explanation: '`new` operates at the C++ object model level, invoking the constructor after allocating bytes. If you free a C++ object with `free()`, its destructor never runs.',
    maxMarks: 10,
    followUpPrompt: 'What is the danger of using `delete` instead of `delete[]` on an array allocated with `new[]`?'
  },
  {
    id: 'mem-003',
    topicId: 'modern-cpp-concepts',
    topicName: 'Modern C++ Concepts',
    difficulty: 'Advanced',
    question: 'Explain the three types of Smart Pointers in C++11 (`std::unique_ptr`, `std::shared_ptr`, `std::weak_ptr`). How does `std::weak_ptr` prevent circular references?',
    expectedAnswer: '`std::unique_ptr` provides exclusive ownership of dynamic memory with zero overhead and cannot be copied. `std::shared_ptr` provides shared ownership via reference counting, deleting the object when the last reference drops to zero. `std::weak_ptr` provides a non-owning observer of a `shared_ptr` without incrementing the reference count, breaking cyclic references that would otherwise prevent deallocation.',
    keyPoints: [
      'std::unique_ptr: exclusive ownership, move-only, zero overhead',
      'std::shared_ptr: shared ownership, reference-counted control block',
      'std::weak_ptr: non-owning observer, no ref-count increment',
      'Circular shared_ptr references (A points to B, B points to A) cause memory leaks',
      'Converting weak_ptr to shared_ptr via lock() allows safe temporary access'
    ],
    hint: 'Think about ownership models: single owner, shared owners, and non-owning watchers.',
    explanation: 'Smart pointers implement RAII for heap memory. If two `shared_ptr` objects point to each other, their reference counts never reach 0, leaking memory. Changing one link to `weak_ptr` breaks the cycle.',
    maxMarks: 10,
    followUpPrompt: 'Why is `std::make_unique` and `std::make_shared` preferred over `new` when creating smart pointers?'
  },

  // ================= STANDARD TEMPLATE LIBRARY (STL) =================
  {
    id: 'stl-001',
    topicId: 'stl-containers',
    topicName: 'STL Containers',
    difficulty: 'Intermediate',
    question: 'Compare `std::vector` and `std::list` in terms of memory layout, random access capabilities, and insertion/deletion time complexity.',
    expectedAnswer: '`std::vector` stores elements in contiguous memory, supports O(1) random access via indexing `[]`, but incurs O(n) reallocation and element shifting on non-tail insertions. `std::list` is a doubly-linked list with non-contiguous node memory, does not support random access (O(n) traversal), but allows O(1) insertions/deletions once an iterator to the position is known.',
    keyPoints: [
      'vector uses contiguous memory array; list uses discrete doubly-linked nodes',
      'vector provides O(1) random access; list requires O(n) sequential traversal',
      'vector push_back is amortized O(1); middle insertion is O(n)',
      'list insertion/deletion is O(1) given an iterator',
      'vector is cache-friendly due to spatial locality, making it faster in practice for most tasks'
    ],
    hint: 'Think about arrays vs doubly-linked lists and cache locality.',
    explanation: 'Due to CPU cache lines and spatial locality, `std::vector` usually outperforms `std::list` even when inserting elements, unless elements are very large or iterator invalidation must be avoided.',
    maxMarks: 10,
    followUpPrompt: 'What is iterator invalidation, and how does `std::vector::push_back` affect existing iterators?'
  },
  {
    id: 'stl-002',
    topicId: 'stl-containers',
    topicName: 'STL Containers',
    difficulty: 'Intermediate',
    question: 'What is the internal data structure difference between `std::map` and `std::unordered_map`? What are their search time complexities?',
    expectedAnswer: '`std::map` is implemented as a self-balancing binary search tree (typically a Red-Black Tree) with keys stored in sorted order and O(log N) lookup/insertion/deletion. `std::unordered_map` is implemented using a Hash Table with hash buckets, provides average O(1) lookup/insertion, and keys are not sorted.',
    keyPoints: [
      'std::map uses Red-Black Tree (balanced BST); keys are sorted',
      'std::unordered_map uses Hash Table; keys are unsorted',
      'map has guaranteed O(log N) worst-case search complexity',
      'unordered_map has average O(1) search, but worst-case O(N) under hash collisions',
      'map requires operator<; unordered_map requires std::hash and operator=='
    ],
    hint: 'One maintains keys in sorted order; the other uses hashing.',
    explanation: 'If you need elements in sorted order or bidirectional iteration, choose `std::map`. If you need maximum lookup speed, choose `std::unordered_map`.',
    maxMarks: 10,
    followUpPrompt: 'What requirements must a custom class satisfy to be used as a key in `std::map` versus `std::unordered_map`?'
  },

  // ================= MODERN C++ & MISCELLANEOUS =================
  {
    id: 'mod-001',
    topicId: 'modern-cpp-concepts',
    topicName: 'Modern C++ Concepts',
    difficulty: 'Advanced',
    question: 'What are Move Semantics and Rvalue References (`&&`) in C++11? What does `std::move` actually do?',
    codeSnippet: `std::vector<int> a = {1, 2, 3, 4, 5};
std::vector<int> b = std::move(a);`,
    expectedAnswer: 'Move semantics allow transferring ownership of expensive heap resources from temporary objects (rvalues) to new objects instead of performing deep copies. An rvalue reference (`T&&`) binds to temporary objects. `std::move` does not move any data itself; it is an unconditional static cast of an expression to an rvalue reference, enabling the move constructor to be selected.',
    keyPoints: [
      'Move semantics transfer resource ownership rather than copying data',
      'Rvalue reference (`&&`) identifies objects that can be safely pilfered',
      'std::move performs an unconditional cast to an rvalue reference (static_cast<T&&>)',
      'std::move does not move anything by itself; it enables calling the move constructor/assignment',
      'Leaves the source object in a valid but unspecified state'
    ],
    hint: 'Does `std::move` move bytes across memory, or is it a type cast telling the compiler "you can steal my internal buffer"?',
    explanation: 'Before C++11, returning a large `std::vector` from a function caused costly deep copies. Move semantics allow the vector to just transfer its internal pointer in O(1) time.',
    maxMarks: 10,
    followUpPrompt: 'What state is an object left in after being moved from?'
  },
  {
    id: 'mod-002',
    topicId: 'modern-cpp-concepts',
    topicName: 'Modern C++ Concepts',
    difficulty: 'Intermediate',
    question: 'Explain Lambda Expressions in C++. What are the different capture modes (`[]`, `[=]`, `[&]`, `[this]`)?',
    codeSnippet: `int factor = 3;
auto multiply = [factor](int x) { return x * factor; };`,
    expectedAnswer: 'A lambda expression is an anonymous inline function object. The capture clause `[]` specifies which variables from the enclosing scope are accessible: `[]` captures nothing, `[=]` captures all enclosing local variables by value (copy), `[&]` captures all by reference, and `[this]` captures the current object pointer.',
    keyPoints: [
      'Anonymous inline callable function object (functor)',
      'Syntax: `[capture](parameters) -> return_type { body }`',
      '`[]` captures nothing',
      '`[=]` captures outer local variables by value (read-only copy)',
      '`[&]` captures outer local variables by reference (can modify outer variable)',
      'Dangerous if a lambda captures references that outlive the stack frame (dangling reference)'
    ],
    hint: 'Look at the square brackets `[...]` at the start of a lambda definition.',
    explanation: 'Lambdas are heavily used with STL algorithms like `std::for_each`, `std::sort`, and `std::find_if`, avoiding the need to write separate standalone functions.',
    maxMarks: 10,
    followUpPrompt: 'Why is `mutable` keyword needed if you want to modify a variable captured by value inside a lambda?'
  }
];

export function getQuestionsByTopic(topicId: string, difficulty?: string): BankQuestion[] {
  let list = QUESTION_BANK;
  if (topicId && topicId !== 'all') {
    list = list.filter(q => q.topicId === topicId);
  }
  if (difficulty && difficulty !== 'Adaptive') {
    list = list.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  return list;
}

export function getRandomBankQuestion(
  topicId: string, 
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced', 
  excludeQuestionsOrIds: string[] = []
): BankQuestion | undefined {
  const normalizedExclusions = new Set(
    excludeQuestionsOrIds.map(x => (x || '').toLowerCase().trim())
  );

  const isExcluded = (q: BankQuestion): boolean => {
    if (normalizedExclusions.has(q.id.toLowerCase())) return true;
    const qText = q.question.toLowerCase().trim();
    if (normalizedExclusions.has(qText)) return true;
    // Check if any excluded text is a significant substring of the question
    for (const excl of normalizedExclusions) {
      if (excl.length > 20 && (qText.includes(excl) || excl.includes(qText))) {
        return true;
      }
    }
    return false;
  };

  // 1. Available unasked pool
  let unaskedPool = QUESTION_BANK.filter(q => !isExcluded(q));

  // If literally every question in bank was asked, fallback to entire pool
  if (unaskedPool.length === 0) {
    unaskedPool = [...QUESTION_BANK];
  }

  // 2. Filter by topic if specified
  let topicPool = unaskedPool;
  if (topicId && topicId !== 'all') {
    const matched = unaskedPool.filter(q => q.topicId === topicId);
    if (matched.length > 0) {
      topicPool = matched;
    }
  }

  // 3. Filter by difficulty
  const exactDiff = topicPool.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  const candidates = exactDiff.length > 0 ? exactDiff : topicPool;

  if (candidates.length === 0) return undefined;
  
  // Pick random candidate from candidates
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
