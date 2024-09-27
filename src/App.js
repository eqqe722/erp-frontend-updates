import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { ChakraProvider, Box, Flex, Heading, Link, VStack, Button, Input, Text, List, ListItem, Image } from '@chakra-ui/react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TrialManagement from './components/TrialManagement';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './components/LanguageToggle';
import i18n from './i18n';
import AdminHeaderFooterEditor from './components/AdminHeaderFooterEditor';
import DocumentManagementModule from './components/DocumentManagementModule';
import DocumentSearch from './components/DocumentSearch';
import { Finance, Inventory, Assets, Vendors } from './components/ModuleComponents';
import IncomingDocumentManagement from './components/IncomingDocumentManagement';
import StatisticsDashboard from './components/StatisticsDashboard';
import ProjectManagementModule from './components/ProjectManagementModule';
import { LanguageProvider } from './contexts/LanguageContext';

// Custom theme
import theme from './theme';

// Translations
import { translations } from './translations';

// Language context
export const LanguageContext = createContext();

// Auth context
export const AuthContext = createContext();

// Utility function to set auth token
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Implement global axios interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const EmployeeManagement = () => {
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [newEmployee, setNewEmployee] = React.useState({ name: '', email: '', department: '' });
  const { t } = useTranslation();

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/`);
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/employees/', newEmployee);
      setNewEmployee({ name: '', email: '', department: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
      setError('Failed to create employee. Please try again.');
    }
  };

  if (loading) return <div>{t('loading')}</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box>
      <Heading as="h2" size="xl" mb={6}>{t('employeeManagement')}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch" mb={6}>
          <Input
            type="text"
            name="name"
            value={newEmployee.name}
            onChange={handleInputChange}
            placeholder={t('name')}
            required
          />
          <Input
            type="email"
            name="email"
            value={newEmployee.email}
            onChange={handleInputChange}
            placeholder={t('email')}
            required
          />
          <Input
            type="text"
            name="department"
            value={newEmployee.department}
            onChange={handleInputChange}
            placeholder={t('department')}
            required
          />
          <Button type="submit" colorScheme="blue">{t('addEmployee')}</Button>
        </VStack>
      </form>
      {employees.length === 0 ? (
        <Text>{t('noEmployeeData')}</Text>
      ) : (
        <List spacing={3}>
          {employees.map(employee => (
            <ListItem key={employee.id}>
              <Text>{employee.name} - {employee.email} - {employee.department}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

const Layout = ({ children }) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  return (
    <Box dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Flex as="header" bg="blue.500" color="white" p={2} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Image src="/ITPC+Logo.png" alt="Logo" boxSize="40px" mr={3} />
          <VStack align="start" spacing={0}>
            <Heading as="h1" size="md">{t('erpSystem')}</Heading>
            <Text fontSize="2xs" color="gray.200">
              جميع الحقوق محفوظة لوزارة الاتصالات - الشركة العامة للاتصالات والمعلوماتية - مديرية المعلوماتية
            </Text>
            <Text fontSize="2xs" color="gray.200">
              تم تطوير هذا النظام من قبل فريق قسم التحول الرقمي
            </Text>
          </VStack>
        </Flex>
        <Flex alignItems="center">
          <Flex as="nav" gap={3} mr={3}>
            <Link as={RouterLink} to="/" _hover={{ color: "blue.200" }}>{t('dashboard')}</Link>
            <Link as={RouterLink} to="/employees" _hover={{ color: "blue.200" }}>{t('employees')}</Link>
            <Link as={RouterLink} to="/finance" _hover={{ color: "blue.200" }}>{t('finance')}</Link>
            <Link as={RouterLink} to="/inventory" _hover={{ color: "blue.200" }}>{t('inventory')}</Link>
            <Link as={RouterLink} to="/projects" _hover={{ color: "blue.200" }}>{t('projects')}</Link>
            <Link as={RouterLink} to="/assets" _hover={{ color: "blue.200" }}>{t('assets')}</Link>
            <Link as={RouterLink} to="/vendors" _hover={{ color: "blue.200" }}>{t('vendors')}</Link>
            <Link as={RouterLink} to="/documents" _hover={{ color: "blue.200" }}>{t('documents')}</Link>
            <Link as={RouterLink} to="/trial-management" _hover={{ color: "blue.200" }}>{t('trialManagement')}</Link>
            <Link as={RouterLink} to="/incoming-documents" _hover={{ color: "blue.200" }}>{t('incomingDocuments')}</Link>
          </Flex>
          <Button
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
            colorScheme="blue"
            variant="outline"
            size="sm"
          >
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </Button>
        </Flex>
      </Flex>
      <Box as="main" p={8}>{children}</Box>
    </Box>
  );
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  useEffect(() => {
    i18n.changeLanguage('ar');
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/employees" element={<EmployeeManagement />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/projects" element={<ProjectManagementModule />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/documents" element={<DocumentManagementModule />} />
                <Route path="/documents/search" element={<DocumentSearch />} />
                <Route path="/trial-management" element={<TrialManagement />} />
                <Route path="/admin/header-footer" element={<AdminHeaderFooterEditor />} />
                <Route path="/incoming-documents" element={<IncomingDocumentManagement />} />
                <Route path="/statistics" element={<StatisticsDashboard />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ChakraProvider>
  );
}

export default App;
