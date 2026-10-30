import { CppTopic } from '../types/index.js';

export const CPP_TOPICS: CppTopic[] = [
  {
    id: 'all',
    name: 'Complete C++ Syllabus',
    category: 'Comprehensive',
    description: 'Covers the full spectrum from fundamentals and OOP to Exception Handling, Templates, Memory, and STL.',
    subtopics: ['Fundamentals', 'OOP', 'Memory & Pointers', 'Exception Handling', 'Templates', 'STL', 'Modern C++'],
    keyConcepts: ['C++ Features', 'Memory Management', 'Polymorphism', 'try/catch', 'Templates', 'STL Containers']
  },
  {
    id: 'cpp-intro-features',
    name: 'Introduction to C++ & Features',
    category: 'Fundamentals',
    description: 'History, characteristics, procedural vs object-oriented, compilation stages, and standard features.',
    subtopics: ['Features of C++', 'Compilation Process', 'Procedural vs OOP', 'C vs C++ differences'],
    keyConcepts: ['Portability', 'Encapsulation', 'Abstraction', 'Header files', 'Linker & Preprocessor']
  },
  {
    id: 'data-types-variables',
    name: 'Variables, Constants & Data Types',
    category: 'Fundamentals',
    description: 'Primitive types, type modifiers, constants, literals, type casting, and variable scope.',
    subtopics: ['Primitive Types', 'Modifiers (signed/unsigned, short/long)', 'const & constexpr', 'Type Casting (static_cast)'],
    keyConcepts: ['Memory sizes', 'Scope and lifetime', 'Type safety', 'const correctness']
  },
  {
    id: 'tokens-keywords-identifiers',
    name: 'Tokens, Keywords & Identifiers',
    category: 'Fundamentals',
    description: 'Building blocks of C++ programs, naming rules, reserved keywords, and literals.',
    subtopics: ['Keywords', 'Identifiers rules', 'Literals', 'Operators as tokens'],
    keyConcepts: ['Naming conventions', 'Reserved words', 'String and char literals']
  },
  {
    id: 'operators-expressions',
    name: 'Operators & Expressions',
    category: 'Fundamentals',
    description: 'Arithmetic, logical, relational, bitwise, assignment, and ternary operators with precedence.',
    subtopics: ['Operator Precedence', 'Associativity', 'Bitwise Operators', 'Ternary Operator', 'Short-circuit evaluation'],
    keyConcepts: ['Evaluation order', 'Prefix vs Postfix increment', 'Bit manipulation']
  },
  {
    id: 'input-output',
    name: 'Input & Output Streams',
    category: 'Fundamentals',
    description: 'Console I/O using cin, cout, cerr, clog, and stream manipulators.',
    subtopics: ['cin & cout', 'cerr vs clog', 'getline() vs cin >>', 'Manipulators (setw, setprecision)'],
    keyConcepts: ['Buffered vs Unbuffered I/O', 'Stream state flags', 'Formatting']
  },
  {
    id: 'conditional-statements',
    name: 'Conditional Statements',
    category: 'Control Flow',
    description: 'Decision making constructs: if, if-else, nested if, and switch-case statements.',
    subtopics: ['if-else ladders', 'switch-case rules', 'Fallthrough & break', 'Init statements in if'],
    keyConcepts: ['Branching', 'Jump tables in switch', 'Condition evaluation']
  },
  {
    id: 'loops',
    name: 'Loops & Iterations',
    category: 'Control Flow',
    description: 'Looping constructs: for, while, do-while, range-based for loops, break, and continue.',
    subtopics: ['while vs do-while', 'Range-based for loop', 'break & continue', 'Infinite loops prevention'],
    keyConcepts: ['Loop invariants', 'Iteration control', 'Off-by-one errors']
  },
  {
    id: 'arrays',
    name: 'Arrays & Memory Layout',
    category: 'Data Structures',
    description: 'Single-dimensional arrays, memory layout, bounds checking, and array decay.',
    subtopics: ['Array initialization', 'Contiguous memory', 'Array to pointer decay', 'std::array vs C-array'],
    keyConcepts: ['Index calculation', 'Buffer overflow risks', 'Cache friendliness']
  },
  {
    id: 'multidimensional-arrays',
    name: 'Multidimensional Arrays',
    category: 'Data Structures',
    description: '2D and N-D arrays, row-major memory order, and matrix operations.',
    subtopics: ['Row-major order', 'Matrix representation', 'Passing 2D arrays to functions', 'Jagged arrays'],
    keyConcepts: ['Memory stride', 'Pointer arithmetic in 2D arrays']
  },
  {
    id: 'strings',
    name: 'Strings (C-Style & std::string)',
    category: 'Data Structures',
    description: 'Null-terminated char arrays vs std::string, string manipulation methods, and memory management.',
    subtopics: ['C-style strings (char[])', 'Null terminator \\0', 'std::string member functions', 'Small String Optimization (SSO)'],
    keyConcepts: ['Immutability vs mutability', 'String methods', 'Buffer safety']
  },
  {
    id: 'functions',
    name: 'Functions & Parameter Passing',
    category: 'Functions',
    description: 'Function prototypes, call by value, call by reference, call by address, and inline functions.',
    subtopics: ['Call by Value vs Reference', 'Pass by pointer', 'Inline functions', 'Default arguments'],
    keyConcepts: ['Stack frame', 'Overhead of copies', 'const references']
  },
  {
    id: 'function-overloading',
    name: 'Function Overloading',
    category: 'Functions',
    description: 'Compile-time polymorphism via signature variation, name mangling, and resolution rules.',
    subtopics: ['Rules of overloading', 'Name mangling', 'Ambiguity resolution', 'Overloading with const and references'],
    keyConcepts: ['Function signatures', 'Type promotion', 'Ambiguity errors']
  },
  {
    id: 'recursion',
    name: 'Recursion & Call Stack',
    category: 'Functions',
    description: 'Recursive functions, base conditions, call stack memory, and tail call optimization.',
    subtopics: ['Base condition', 'Direct vs Indirect recursion', 'Tail recursion', 'Stack overflow prevention'],
    keyConcepts: ['Call stack activation records', 'Divide and conquer', 'Recurrence relations']
  },
  {
    id: 'pointers',
    name: 'Pointers & Pointer Arithmetic',
    category: 'Memory & Pointers',
    description: 'Memory addresses, dereferencing, pointer arithmetic, void pointers, null pointers, and dangling pointers.',
    subtopics: ['Dereferencing (*)', 'Address-of (&)', 'nullptr vs NULL', 'Dangling pointers & wild pointers', 'Pointer to pointer'],
    keyConcepts: ['Direct memory access', 'Pointer arithmetic scale', 'Memory leaks']
  },
  {
    id: 'references',
    name: 'References & Aliasing',
    category: 'Memory & Pointers',
    description: 'Lvalue references, rvalue references (C++11), differences between pointers and references.',
    subtopics: ['Pointers vs References', 'const references', 'Rvalue references (&&)', 'Reference re-binding impossibility'],
    keyConcepts: ['Aliasing', 'Pass-by-const-ref efficiency', 'Move semantics basis']
  },
  {
    id: 'structures-unions',
    name: 'Structures & Unions',
    category: 'User-Defined Types',
    description: 'struct in C vs C++, union memory sharing, anonymous unions, and memory alignment/padding.',
    subtopics: ['struct vs class differences', 'Union memory sharing', 'Structure padding & alignment', 'Bit fields'],
    keyConcepts: ['Default access levels', 'Shared memory in unions', 'sizeof evaluation']
  },
  {
    id: 'classes-objects',
    name: 'Classes & Objects',
    category: 'Object-Oriented Programming',
    description: 'Encapsulation, object instantiation, member variables, member functions, and this pointer.',
    subtopics: ['Encapsulation', 'this pointer', 'Object lifecycle', 'const member functions'],
    keyConcepts: ['State and behavior', 'Information hiding', 'Memory allocation for objects']
  },
  {
    id: 'access-specifiers',
    name: 'Access Specifiers (public, private, protected)',
    category: 'Object-Oriented Programming',
    description: 'Controlling visibility and access to class members, impact on inheritance.',
    subtopics: ['public, private, protected', 'Access specifiers in inheritance', 'Data hiding best practices'],
    keyConcepts: ['Principle of least privilege', 'Subclass accessibility', 'Encapsulation boundaries']
  },
  {
    id: 'constructors',
    name: 'Constructors & Initialization Lists',
    category: 'Object-Oriented Programming',
    description: 'Default, parameterized, copy, and move constructors, member initializer lists, and explicit keyword.',
    subtopics: ['Member Initializer List', 'Copy Constructor & Deep vs Shallow Copy', 'Move Constructor', 'explicit constructors'],
    keyConcepts: ['Object initialization', 'Resource allocation in constructors', 'Preventing implicit conversion']
  },
  {
    id: 'destructors',
    name: 'Destructors & Resource Cleanup',
    category: 'Object-Oriented Programming',
    description: 'Destructor syntax, call order, RAII pattern, and virtual destructors in inheritance.',
    subtopics: ['Destructor execution order', 'RAII (Resource Acquisition Is Initialization)', 'Virtual Destructors importance', 'No-throw destructors'],
    keyConcepts: ['Resource deallocation', 'Virtual table lookup on delete', 'Preventing memory leaks']
  },
  {
    id: 'static-members',
    name: 'Static Data Members & Static Functions',
    category: 'Object-Oriented Programming',
    description: 'Class-level variables, static methods, independent invocation, and memory allocation outside objects.',
    subtopics: ['Static variable definition outside class', 'Static member functions without this pointer', 'Singleton pattern foundation'],
    keyConcepts: ['Class scope', 'Shared state across instances', 'Non-object invocation']
  },
  {
    id: 'friend-functions-classes',
    name: 'Friend Functions & Friend Classes',
    category: 'Object-Oriented Programming',
    description: 'Granting non-member functions or other classes access to private/protected members, encapsulation trade-offs.',
    subtopics: ['friend keyword', 'Friend functions', 'Friend classes', 'Friendship is not transitive or inherited'],
    keyConcepts: ['Controlled access breach', 'Operator overloading helpers', 'Encapsulation impact']
  },
  {
    id: 'inheritance',
    name: 'Inheritance & Its Major Types',
    category: 'Object-Oriented Programming',
    description: 'Single, Multilevel, Hierarchical, Multiple, and Hybrid inheritance, base class constructor calling.',
    subtopics: ['Single & Multilevel inheritance', 'Hierarchical inheritance', 'Constructor calling sequence', 'is-a relationship'],
    keyConcepts: ['Code reuse', 'Base class initialization', 'Subclass specialization']
  },
  {
    id: 'multiple-inheritance-ambiguity',
    name: 'Multiple Inheritance & Diamond Problem',
    category: 'Object-Oriented Programming',
    description: 'Inheriting from multiple parents, ambiguity resolution, the Diamond Problem, and virtual base classes.',
    subtopics: ['Multiple inheritance syntax', 'Ambiguity resolution with scope operator', 'Diamond Problem', 'virtual base class'],
    keyConcepts: ['Duplicate base subobjects', 'Virtual table layout in virtual inheritance']
  },
  {
    id: 'polymorphism',
    name: 'Polymorphism (Compile-time & Run-time)',
    category: 'Object-Oriented Programming',
    description: 'Concept of polymorphism, static binding vs dynamic binding, virtual dispatch mechanism.',
    subtopics: ['Compile-time (Static) Binding', 'Run-time (Dynamic) Binding', 'Early vs Late binding', 'Virtual function dispatch'],
    keyConcepts: ['Polymorphic behavior', 'VTABLE and VPTR', 'Dynamic dispatch overhead']
  },
  {
    id: 'operator-overloading',
    name: 'Operator Overloading',
    category: 'Object-Oriented Programming',
    description: 'Overloading unary and binary operators, stream insertion/extraction operators, and assignment operator.',
    subtopics: ['Operator syntax', 'Member vs Friend operator overloading', 'Overloading << and >>', 'Assignment operator (=)'],
    keyConcepts: ['Custom type semantics', 'Self-assignment check', 'Return by reference vs value']
  },
  {
    id: 'function-overriding',
    name: 'Function Overriding & Hiding',
    category: 'Object-Oriented Programming',
    description: 'Redefining base class methods in derived classes, difference from overloading, and function hiding.',
    subtopics: ['Overriding vs Overloading', 'Name hiding (slicing)', 'override specifier (C++11)', 'final specifier'],
    keyConcepts: ['Runtime resolution', 'Signature matching', 'Explicit override checking']
  },
  {
    id: 'virtual-functions',
    name: 'Virtual Functions, VTABLE & VPTR',
    category: 'Object-Oriented Programming',
    description: 'virtual keyword, VTABLE and VPTR internals, dynamic binding, and virtual destructors.',
    subtopics: ['VTABLE structure', 'VPTR pointer per object', 'Cost of virtual calls', 'Virtual destructors necessity'],
    keyConcepts: ['Dynamic dispatch', 'Memory footprint of VPTR', 'Base pointer to derived object']
  },
  {
    id: 'abstract-classes',
    name: 'Abstract Classes & Pure Virtual Functions',
    category: 'Object-Oriented Programming',
    description: 'Pure virtual functions (= 0), abstract base classes, interfaces, and concrete derived implementations.',
    subtopics: ['Pure virtual function syntax', 'Inability to instantiate abstract class', 'Interface design in C++', 'Concrete subclasses'],
    keyConcepts: ['Contract enforcement', 'Polymorphic interfaces', 'Partial implementations']
  },
  {
    id: 'exception-handling',
    name: 'Exception Handling (College Activity Required)',
    category: 'Advanced & Core Activity',
    description: 'try, throw, and catch blocks, multiple catch blocks, nested try, re-throwing, catch-all (...), and custom exception classes.',
    subtopics: [
      'try, throw, and catch mechanism',
      'Multiple catch blocks & ordering',
      'Catch-all block catch(...)',
      'Nested try blocks & re-throwing (throw;)',
      'Custom exceptions inheriting from std::exception',
      'Stack unwinding during exceptions',
      'noexcept keyword & exception safety guarantees'
    ],
    keyConcepts: [
      'try-throw-catch syntax',
      'Catch by reference to prevent slicing',
      'Derived before base catch ordering',
      'Resource cleanup during stack unwinding',
      'Custom exception what() method'
    ]
  },
  {
    id: 'templates',
    name: 'Templates & Generic Programming (College Activity Required)',
    category: 'Advanced & Core Activity',
    description: 'Function templates, class templates, non-type template parameters, template specialization, and real-world applications.',
    subtopics: [
      'Function templates syntax & deduction',
      'Class templates syntax & instantiation',
      'Multiple template parameters',
      'Non-type template parameters (e.g., template<typename T, int Size>)',
      'Template specialization (Full & Partial)',
      'Templates vs Macros differences',
      'Compilation model of templates (header inclusion)'
    ],
    keyConcepts: [
      'Generic programming',
      'Code generation at compile time',
      'Type independence',
      'Explicit instantiation & specialization',
      'Template instantiation errors'
    ]
  },
  {
    id: 'file-handling',
    name: 'File Handling & File Operations',
    category: 'File I/O',
    description: 'Opening, reading, writing, and closing files, file modes (ios::in, ios::out, ios::app, ios::binary).',
    subtopics: ['fstream, ifstream, ofstream', 'File open modes', 'Checking file open state (is_open())', 'Binary vs Text file operations'],
    keyConcepts: ['File descriptors/streams', 'Buffer flushing', 'Closing files and RAII']
  },
  {
    id: 'file-streams',
    name: 'File Streams & Stream Pointers',
    category: 'File I/O',
    description: 'Stream position pointers (seekg, seekp, tellg, tellp), error handling flags (eof, fail, bad, good).',
    subtopics: ['seekg & tellg for input stream', 'seekp & tellp for output stream', 'Stream state bits (eofbit, failbit, badbit)', 'Reading structured binary data'],
    keyConcepts: ['Random access in files', 'Stream state checking', 'File offset calculation']
  },
  {
    id: 'dynamic-memory-allocation',
    name: 'Dynamic Memory Allocation (new & delete)',
    category: 'Memory & Pointers',
    description: 'new vs malloc, delete vs free, new[] and delete[], memory leaks, and std::bad_alloc.',
    subtopics: ['new / delete operators', 'new[] / delete[] array mismatch danger', 'malloc/free vs new/delete', 'std::nothrow vs bad_alloc', 'Memory leak detection'],
    keyConcepts: ['Heap vs Stack', 'Constructor invocation by new', 'Destructor invocation by delete']
  },
  {
    id: 'stl-overview',
    name: 'Standard Template Library (STL) Overview',
    category: 'STL & Data Structures',
    description: 'The four pillars of STL: Containers, Iterators, Algorithms, and Functors.',
    subtopics: ['STL architecture', 'Time complexities of STL operations', 'Containers classification', 'Iterators role as glue'],
    keyConcepts: ['Separation of algorithms from data structures', 'Generic efficiency', 'Complexity guarantees']
  },
  {
    id: 'stl-containers',
    name: 'STL Containers (vector, list, stack, queue, map)',
    category: 'STL & Data Structures',
    description: 'Sequence containers (vector, deque, list), container adaptors (stack, queue, priority_queue), and associative containers (map, set, unordered_map).',
    subtopics: ['std::vector dynamic resizing & capacity', 'std::list doubly-linked list', 'std::map (Red-Black tree) vs std::unordered_map (Hash table)', 'std::stack & std::queue adaptors'],
    keyConcepts: ['Amortized constant time in vector push_back', 'O(log N) vs O(1) lookups', 'Iterator invalidation']
  },
  {
    id: 'iterators',
    name: 'Iterators & Traversal',
    category: 'STL & Data Structures',
    description: 'Iterator categories (Input, Output, Forward, Bidirectional, Random Access), iterator arithmetic, and invalidation rules.',
    subtopics: ['Iterator categories', 'begin(), end(), rbegin(), rend()', 'cbegin() and const_iterator', 'Iterator invalidation during vector insertion/deletion'],
    keyConcepts: ['Pointer abstraction', 'Dereferencing iterators', 'Safe traversal']
  },
  {
    id: 'namespaces',
    name: 'Namespaces & Scope Resolution',
    category: 'Modern C++',
    description: 'Preventing name collisions, defining namespaces, nested namespaces, using directive pitfalls, and anonymous namespaces.',
    subtopics: ['namespace definition', 'using namespace std; why avoid in headers', 'Anonymous (unnamed) namespaces vs static', 'Nested namespaces'],
    keyConcepts: ['Symbol resolution', 'Name collision prevention', 'Internal linkage']
  },
  {
    id: 'modern-cpp-concepts',
    name: 'Modern C++ Concepts (Smart Pointers, Lambdas, Move)',
    category: 'Modern C++',
    description: 'Smart pointers (unique_ptr, shared_ptr, weak_ptr), lambda expressions, auto type deduction, and move semantics (std::move).',
    subtopics: ['std::unique_ptr (exclusive ownership)', 'std::shared_ptr and reference count', 'std::weak_ptr preventing circular references', 'Lambda capture clauses [=, &]', 'Move semantics and rvalue references'],
    keyConcepts: ['Zero-overhead abstractions', 'Deterministic resource management', 'Avoiding unnecessary copies']
  }
];

export function getTopicById(id: string): CppTopic | undefined {
  return CPP_TOPICS.find(t => t.id === id);
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  CPP_TOPICS.forEach(t => set.add(t.category));
  return Array.from(set);
}
