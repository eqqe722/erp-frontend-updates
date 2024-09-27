import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const IncomingDocumentManagement = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [documents, setDocuments] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: '',
    status: 'pending',
    documentNumber: '',
    issueDate: '',
    issuingEntity: '',
    accompanyingDocuments: '',
    receiptDate: '',
    responsiblePerson: '',
    content: '',
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
    fetchInbox();
    if (quillRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
      editorRef.current.on('text-change', () => {
        setNewDocument(prev => ({
          ...prev,
          content: editorRef.current.root.innerHTML
        }));
      });
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: t('errorFetchingDocuments'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchInbox = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/inbox`);
      setInbox(response.data);
    } catch (error) {
      console.error('Error fetching inbox:', error);
      toast({
        title: t('errorFetchingInbox'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({ ...newDocument, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/documents`, newDocument);
      fetchDocuments();
      setNewDocument({
        title: '',
        type: '',
        status: 'pending',
        documentNumber: '',
        issueDate: '',
        issuingEntity: '',
        accompanyingDocuments: '',
        receiptDate: '',
        responsiblePerson: '',
        content: '',
      });
      if (editorRef.current) {
        editorRef.current.setContents([]);
      }
      toast({
        title: t('documentAdded'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: t('errorAddingDocument'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/documents/${id}`, { status: 'archived' });
      fetchDocuments();
      toast({
        title: t('documentArchived'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error archiving document:', error);
      toast({
        title: t('errorArchivingDocument'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAssignTask = async (id) => {
    setSelectedDocument(documents.find(doc => doc.id === id));
    onOpen();
  };

  const handleTaskAssignment = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/documents/${selectedDocument.id}/assign`, { assignee: selectedDocument.assignee });
      fetchDocuments();
      onClose();
      toast({
        title: t('taskAssigned'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: t('errorAssigningTask'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTrackDocument = async (id) => {
    try {
      const response = await axios.get(`/api/documents/${id}/track`);
      toast({
        title: t('documentTracking'),
        description: response.data.status,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error tracking document:', error);
      toast({
        title: t('errorTrackingDocument'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleViewDocument = async (id) => {
    try {
      const response = await axios.get(`/api/documents/${id}`);
      setSelectedDocument(response.data);
      if (editorRef.current) {
        editorRef.current.setContents(editorRef.current.clipboard.convert(response.data.content));
      }
      toast({
        title: t('documentViewed'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: t('errorViewingDocument'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePrint = () => {
    if (selectedDocument) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedDocument.title}</title>
          </head>
          <body>
            <h1>${selectedDocument.title}</h1>
            ${selectedDocument.content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Box>
      <Heading mb={4}>{t('documentManagement')}</Heading>
      <Tabs>
        <TabList>
          <Tab>{t('documents')}</Tab>
          <Tab>{t('inbox')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <Input
                    name="documentNumber"
                    placeholder={t('documentNumber')}
                    value={newDocument.documentNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="issueDate"
                    type="date"
                    placeholder={t('issueDate')}
                    value={newDocument.issueDate}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="issuingEntity"
                    placeholder={t('issuingEntity')}
                    value={newDocument.issuingEntity}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="title"
                    placeholder={t('documentTitle')}
                    value={newDocument.title}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="accompanyingDocuments"
                    placeholder={t('accompanyingDocuments')}
                    value={newDocument.accompanyingDocuments}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="receiptDate"
                    type="date"
                    placeholder={t('receiptDate')}
                    value={newDocument.receiptDate}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="responsiblePerson"
                    placeholder={t('responsiblePerson')}
                    value={newDocument.responsiblePerson}
                    onChange={handleInputChange}
                    required
                  />
                  <Select
                    name="type"
                    placeholder={t('selectDocumentType')}
                    value={newDocument.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="invoice">{t('invoice')}</option>
                    <option value="report">{t('report')}</option>
                    <option value="contract">{t('contract')}</option>
                  </Select>
                  <Box ref={quillRef} h="200px" mb={4} />
                  <Button type="submit" colorScheme="blue">
                    {t('addDocument')}
                  </Button>
                </VStack>
              </form>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t('title')}</Th>
                    <Th>{t('type')}</Th>
                    <Th>{t('status')}</Th>
                    <Th>{t('assignee')}</Th>
                    <Th>{t('actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {documents.map((doc) => (
                    <Tr key={doc.id}>
                      <Td>{doc.title}</Td>
                      <Td>{doc.type}</Td>
                      <Td>{doc.status}</Td>
                      <Td>{doc.assignee || '-'}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button size="sm" onClick={() => handleArchive(doc.id)} isDisabled={doc.status === 'archived'}>
                            {t('archive')}
                          </Button>
                          <Button size="sm" onClick={() => handleAssignTask(doc.id)}>
                            {t('assignTask')}
                          </Button>
                          <Button size="sm" onClick={() => handleTrackDocument(doc.id)}>
                            {t('track')}
                          </Button>
                          <Button size="sm" onClick={() => handleViewDocument(doc.id)}>
                            {t('view')}
                          </Button>
                          <Button size="sm" onClick={handlePrint}>
                            {t('print')}
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Heading size="md">{t('inbox')}</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t('title')}</Th>
                    <Th>{t('sender')}</Th>
                    <Th>{t('receivedDate')}</Th>
                    <Th>{t('actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inbox.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.title}</Td>
                      <Td>{item.sender}</Td>
                      <Td>{item.receivedDate}</Td>
                      <Td>
                        <Button size="sm" onClick={() => handleViewDocument(item.id)}>
                          {t('view')}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('assignTask')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{t('assignTo')}</FormLabel>
              <Input
                placeholder={t('enterAssigneeName')}
                value={selectedDocument?.assignee || ''}
                onChange={(e) => setSelectedDocument({ ...selectedDocument, assignee: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleTaskAssignment}>
              {t('assign')}
            </Button>
            <Button variant="ghost" onClick={onClose}>{t('cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default IncomingDocumentManagement;
